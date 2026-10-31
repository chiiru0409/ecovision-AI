import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.config import settings
from app.database.models import Base, CategoryInformation

logger = logging.getLogger("ecovision.database")

# Initial Category Knowledge Seeds
DEFAULT_CATEGORIES = [
    {
        "category_name": "Cardboard",
        "description": "Corrugated cardboard boxes, packaging cartons, shipping containers, and heavy paperboard packaging.",
        "disposal_method": "Flatten boxes to save volume, remove excessive tape and plastic shipping wrappers, and deposit in the dry paper/cardboard recycling bin.",
        "recycling_instructions": "Keep clean and dry. Light packing labels are acceptable, but wet, moldy, or food-greased cardboard (like pizza boxes) must be sent to compost or organic streams.",
        "environmental_benefit": "Recyclable 5 to 7 times. Recycling one ton of cardboard saves 9 cubic yards of landfill space, 4,000 kWh of energy, and reduces sulfur dioxide emissions."
    },
    {
        "category_name": "Glass",
        "description": "Clear, green, and brown glass jars, beverage bottles, culinary containers, and condiment glassware.",
        "disposal_method": "Rinse out liquids and food residue thoroughly. Separate metal or plastic screw caps and place in your curbside glass recycling bin or neighborhood bottle bank.",
        "recycling_instructions": "100% infinitely recyclable without any loss in purity, strength, or structural clarity. Do not mix with mirrors, light bulbs, or Pyrex ceramics.",
        "environmental_benefit": "Remelting recycled glass cullet consumes 30% less energy than raw sand and soda ash synthesis, saving 500 kg of CO2 per ton recycled."
    },
    {
        "category_name": "Metal",
        "description": "Aluminum beverage soda cans, tin/steel canned food containers, aluminum foil trays, and clean metal caps.",
        "disposal_method": "Rinse clean of organic residues. Flatten aluminum cans to maximize bin capacity and place into mixed recyclables.",
        "recycling_instructions": "Infinitely recyclable with zero degradation of elemental properties. An aluminum can is remelted and restocked on supermarket shelves in under 60 days.",
        "environmental_benefit": "Recycling aluminum consumes 95% less energy than mining and refining bauxite ore, drastically diminishing toxic red mud waste."
    },
    {
        "category_name": "Organic",
        "description": "Biodegradable organic substances: food scraps, fruit peels, vegetable ends, coffee grounds, eggshells, and garden trimmings.",
        "disposal_method": "Place directly into your municipal green organics bin, compost caddy, or backyard composting system. Never bag in conventional plastic.",
        "recycling_instructions": "Processes via aerobic microbial decomposition into rich compost soil conditioner or via anaerobic biodigesters into renewable biogas.",
        "environmental_benefit": "Diverting organics from landfills eliminates methane generation (28x more potent than CO2) and restores vital micronutrients to agricultural topsoil."
    },
    {
        "category_name": "Paper",
        "description": "Office copy sheets, notebook pages, envelopes, catalogs, newspapers, paper bags, and dry magazines.",
        "disposal_method": "Keep dry, crisp, and unsoiled. Place into designated paper recycling bins or paper drop receptacles.",
        "recycling_instructions": "Do not recycle paper that is food-greased, laminated with plastic films, or wax-lined. Shredded paper should be enclosed in a paper envelope if mandated locally.",
        "environmental_benefit": "Recycling 1 ton of paper saves 17 mature trees, 7,000 gallons of water, 3.3 cubic yards of landfill, and 4,100 kilowatt-hours of electrical power."
    },
    {
        "category_name": "Plastic",
        "description": "Rigid and semi-rigid plastic packaging: PET water bottles, HDPE milk jugs, detergent containers, plastic tubs, and bottle lids.",
        "disposal_method": "Empty and lightly rinse. Replace screw caps on bottles so they are recovered at material recovery facilities. Place in plastics recycling.",
        "recycling_instructions": "Inspect the resin identification triangle (codes 1-7). Codes #1 (PET) and #2 (HDPE) have the highest recycling value worldwide. Avoid single-use soft films.",
        "environmental_benefit": "Diverting plastics prevents dangerous marine microplastic contamination, decreases crude oil extraction, and lowers industrial carbon footprints."
    },
    {
        "category_name": "Trash",
        "description": "Non-recyclable composite residuals: contaminated packaging, sanitary items, broken ceramics, dirty wrappers, and composite foils.",
        "disposal_method": "Bag securely in municipal trash bags and place into your grey or black residual landfill bin.",
        "recycling_instructions": "Non-recyclable through standard municipal sorting facilities. Destined for modern sanitary landfills or waste-to-energy (WTE) incineration.",
        "environmental_benefit": "Diligent upstream segregation ensures minimal trash volume reaches landfills, prolonging landfill lifespan and conserving municipal resources."
    }
]

# Database Connection Selection
def get_engine():
    if settings.DATABASE_URL:
        db_url = settings.DATABASE_URL
        if db_url.startswith("postgres://"):
            db_url = db_url.replace("postgres://", "postgresql://", 1)
        logger.info("Connecting to PostgreSQL/Supabase database.")
        return create_engine(db_url, pool_pre_ping=True)
    else:
        # SQLite Fallback
        settings.SQLITE_PATH.parent.mkdir(parents=True, exist_ok=True)
        sqlite_url = f"sqlite:///{settings.SQLITE_PATH.as_posix()}"
        logger.info(f"Using SQLite database engine at {sqlite_url}")
        return create_engine(sqlite_url, connect_args={"check_same_thread": False})

engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    """Initializes tables and seeds the 7 default categories."""
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    try:
        for cat in DEFAULT_CATEGORIES:
            existing = db.query(CategoryInformation).filter_by(category_name=cat["category_name"]).first()
            if not existing:
                new_cat = CategoryInformation(**cat)
                db.add(new_cat)
            else:
                # Update details if changed
                existing.description = cat["description"]
                existing.disposal_method = cat["disposal_method"]
                existing.recycling_instructions = cat["recycling_instructions"]
                existing.environmental_benefit = cat["environmental_benefit"]
        db.commit()
        logger.info("Database initialized and categories seeded successfully.")
    except Exception as e:
        db.rollback()
        logger.error(f"Error seeding database: {e}")
    finally:
        db.close()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
