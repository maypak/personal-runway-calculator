-- Add currency column to finance_settings
ALTER TABLE public.finance_settings 
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';

-- Add constraint for valid currencies
ALTER TABLE public.finance_settings
ADD CONSTRAINT valid_currency CHECK (currency IN ('USD', 'KRW', 'EUR', 'GBP', 'JPY', 'CNY', 'AUD', 'CAD'));

-- Update existing rows to use USD as default
UPDATE public.finance_settings 
SET currency = 'USD' 
WHERE currency IS NULL;
