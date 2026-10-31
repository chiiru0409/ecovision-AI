-- ====================================================================
-- EcoVision AI Database Schema
-- Supabase PostgreSQL DDL and Seed Data
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create category_information Table
CREATE TABLE IF NOT EXISTS category_information (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    disposal_method TEXT NOT NULL,
    recycling_instructions TEXT NOT NULL,
    environmental_benefit TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create classifications Table
CREATE TABLE IF NOT EXISTS classifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_name VARCHAR(255) NOT NULL,
    predicted_class VARCHAR(50) NOT NULL,
    confidence FLOAT NOT NULL,
    top_predictions JSONB NOT NULL,
    model_version VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Performance Indices for Analytics & History Queries
CREATE INDEX IF NOT EXISTS idx_classifications_predicted_class ON classifications(predicted_class);
CREATE INDEX IF NOT EXISTS idx_classifications_created_at ON classifications(created_at DESC);

-- 5. Seed Category Information
INSERT INTO category_information (category_name, description, disposal_method, recycling_instructions, environmental_benefit)
VALUES
    (
        'Cardboard',
        'Heavy-duty packaging boxes, corrugated cartons, shipping crates, and packaging materials made from unbleached wood pulp.',
        'Flatten cartons and deposit into the designated paper/cardboard recycling bin. Keep dry and avoid liquid exposure.',
        'Strip packing tape and plastic shipping labels if possible. Do not recycle if soaked with food grease or oil (e.g., pizza boxes should be composted).',
        'Cardboard can be recycled 5 to 7 times. Recycling one ton of cardboard saves 9 cubic yards of landfill space and 24% production energy.'
    ),
    (
        'Glass',
        'Transparent or colored soda-lime glass containers including food jars, beverage bottles, and condiment glassware.',
        'Rinse containers cleanly to eliminate organic residue. Remove metal lids and place in dedicated curbside glass bins or bottle drop depots.',
        '100% infinitely recyclable without degrading clarity or chemical strength. Do not mix with heat-resistant borosilicate cookware or window panes.',
        'Using recycled cullet in furnaces lowers processing temperatures, reducing greenhouse gas emissions by up to 500 kg CO2 per ton produced.'
    ),
    (
        'Metal',
        'Ferrous and non-ferrous metals including aluminum beverage cans, tin/steel food cans, foil containers, and metal lids.',
        'Rinse away contents. Compact or crush aluminum cans to optimize bin capacity and place into municipal mixed dry recyclables.',
        'Infinitely recyclable without structural loss. Aluminum cans can be melted, rolled, and returned to retail shelves as new cans in under 60 days.',
        'Recycling aluminum saves 95% of the massive electrical energy required to smelt virgin aluminum from raw bauxite ore.'
    ),
    (
        'Paper',
        'Dry clean paper products including newspapers, magazines, office copy paper, paperboard packaging, and envelopes.',
        'Keep dry and clean. Flatten sheets and deposit into the paper recycling stream or bagged paper collection.',
        'Avoid recycling thermal receipts, wax-coated cartons, or heavily soiled items. Clean paper is repulped into paper towels and newsprint.',
        'Recycling one ton of paper saves approximately 17 mature trees, 7,000 gallons of fresh water, and 4,000 kilowatt-hours of electrical power.'
    ),
    (
        'Plastic',
        'Rigid and flexible synthetic polymers such as PET water bottles, HDPE milk jugs, shampoo bottles, and food containers (resin codes 1-7).',
        'Empty and lightly rinse. Replace the screw cap on bottles to ensure the cap is captured during processing. Place in plastics recycling bin.',
        'Check bottom resin identification codes. Codes #1 (PET) and #2 (HDPE) are globally welcomed; avoid non-recyclable multi-layer films.',
        'Diverting plastics from landfills halts toxic microplastic leaching into ocean biomes and conserves petrochemical fossil resources.'
    ),
    (
        'Organic',
        'Biodegradable organic matter including food trimmings, fruit peels, vegetable scraps, coffee grounds, eggshells, and garden clippings.',
        'Deposit into your residential green organics/compost cart or backyard compost bin. Avoid mixing with plastic bags or packaging.',
        'Naturally breaks down through biological microbial aerobic composting or anaerobic digestion into nutrient-dense humus soil amendment.',
        'Diverting organic waste from anaerobic landfills eliminates dangerous methane gas emissions, which are 28x more potent than CO2.'
    ),
    (
        'Trash',
        'Non-recyclable composite, contaminated, or mixed residual refuse including sanitary hygiene products, broken ceramics, and dirty packaging.',
        'Bag securely and dispose into your primary municipal general waste or landfill bin.',
        'Non-recyclable in current standard consumer municipal recycling facilities. Destined for modern sanitary landfill or waste-to-energy incineration.',
        'Careful prior separation of recyclables and compostables minimizes the volume of refuse sent to permanent landfills.'
    )
ON CONFLICT (category_name) DO UPDATE 
SET description = EXCLUDED.description,
    disposal_method = EXCLUDED.disposal_method,
    recycling_instructions = EXCLUDED.recycling_instructions,
    environmental_benefit = EXCLUDED.environmental_benefit;
