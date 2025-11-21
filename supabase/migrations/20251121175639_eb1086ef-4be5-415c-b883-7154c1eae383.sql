-- Create paiements table for monthly tuition payments
CREATE TABLE IF NOT EXISTS public.paiements (
  id BIGSERIAL PRIMARY KEY,
  enfant_id BIGINT NOT NULL,
  montant DECIMAL(10,2) NOT NULL,
  date_paiement DATE NOT NULL DEFAULT CURRENT_DATE,
  methode_paiement TEXT NOT NULL DEFAULT 'Espèces',
  mois_concerne TEXT,
  annee_scolaire TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create paiements_inscription table for registration payments
CREATE TABLE IF NOT EXISTS public.paiements_inscription (
  id BIGSERIAL PRIMARY KEY,
  enfant_id BIGINT NOT NULL,
  montant DECIMAL(10,2) NOT NULL,
  date_paiement DATE NOT NULL DEFAULT CURRENT_DATE,
  methode_paiement TEXT NOT NULL DEFAULT 'Espèces',
  annee_scolaire TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on both tables
ALTER TABLE public.paiements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paiements_inscription ENABLE ROW LEVEL SECURITY;

-- Create policies for paiements (allow all operations for now)
CREATE POLICY "Allow all operations on paiements"
  ON public.paiements
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create policies for paiements_inscription (allow all operations for now)
CREATE POLICY "Allow all operations on paiements_inscription"
  ON public.paiements_inscription
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_paiements_date ON public.paiements(date_paiement);
CREATE INDEX IF NOT EXISTS idx_paiements_inscription_date ON public.paiements_inscription(date_paiement);
CREATE INDEX IF NOT EXISTS idx_paiements_enfant ON public.paiements(enfant_id);
CREATE INDEX IF NOT EXISTS idx_paiements_inscription_enfant ON public.paiements_inscription(enfant_id);