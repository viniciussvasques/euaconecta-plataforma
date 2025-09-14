-- Adicionar campos de markup sobre frete na tabela PlatformConfig
ALTER TABLE "PlatformConfig" 
ADD COLUMN "freightMarkupPercentage" DECIMAL(5,4) DEFAULT 0.15,
ADD COLUMN "freightMarkupMinAmount" INTEGER DEFAULT 200,
ADD COLUMN "freightMarkupMaxAmount" INTEGER DEFAULT 5000,
ADD COLUMN "processingFeeUsdCents" INTEGER DEFAULT 300;

-- Comentários para documentar os novos campos
COMMENT ON COLUMN "PlatformConfig"."freightMarkupPercentage" IS 'Percentual de markup sobre frete (ex: 0.15 = 15%)';
COMMENT ON COLUMN "PlatformConfig"."freightMarkupMinAmount" IS 'Valor mínimo de markup em centavos (ex: 200 = $2.00)';
COMMENT ON COLUMN "PlatformConfig"."freightMarkupMaxAmount" IS 'Valor máximo de markup em centavos (ex: 5000 = $50.00)';
COMMENT ON COLUMN "PlatformConfig"."processingFeeUsdCents" IS 'Taxa de processamento em centavos (ex: 300 = $3.00)';
