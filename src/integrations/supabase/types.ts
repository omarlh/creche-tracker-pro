export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      enfants: {
        Row: {
          annee_scolaire: string | null
          assurance_declaree: boolean | null
          classe: string | null
          date_assurance: string | null
          date_fin_inscription: string | null
          date_inscription: string | null
          date_naissance: string | null
          dernier_paiement: string | null
          frais_scolarite_mensuel: number | null
          gsm_maman: string | null
          gsm_papa: string | null
          id: number
          montant_paye: number | null
          montant_total: number | null
          nom: string
          prenom: string
          statut: string | null
        }
        Insert: {
          annee_scolaire?: string | null
          assurance_declaree?: boolean | null
          classe?: string | null
          date_assurance?: string | null
          date_fin_inscription?: string | null
          date_inscription?: string | null
          date_naissance?: string | null
          dernier_paiement?: string | null
          frais_scolarite_mensuel?: number | null
          gsm_maman?: string | null
          gsm_papa?: string | null
          id?: number
          montant_paye?: number | null
          montant_total?: number | null
          nom: string
          prenom: string
          statut?: string | null
        }
        Update: {
          annee_scolaire?: string | null
          assurance_declaree?: boolean | null
          classe?: string | null
          date_assurance?: string | null
          date_fin_inscription?: string | null
          date_inscription?: string | null
          date_naissance?: string | null
          dernier_paiement?: string | null
          frais_scolarite_mensuel?: number | null
          gsm_maman?: string | null
          gsm_papa?: string | null
          id?: number
          montant_paye?: number | null
          montant_total?: number | null
          nom?: string
          prenom?: string
          statut?: string | null
        }
        Relationships: []
      }
      paiements: {
        Row: {
          annee_scolaire: string | null
          commentaire: string | null
          created_at: string | null
          date_paiement: string | null
          dernier_rappel: string | null
          enfant_id: number | null
          id: number
          methode_paiement: string | null
          mois_concerne: string
          montant: number
          statut: string | null
        }
        Insert: {
          annee_scolaire?: string | null
          commentaire?: string | null
          created_at?: string | null
          date_paiement?: string | null
          dernier_rappel?: string | null
          enfant_id?: number | null
          id?: number
          methode_paiement?: string | null
          mois_concerne: string
          montant: number
          statut?: string | null
        }
        Update: {
          annee_scolaire?: string | null
          commentaire?: string | null
          created_at?: string | null
          date_paiement?: string | null
          dernier_rappel?: string | null
          enfant_id?: number | null
          id?: number
          methode_paiement?: string | null
          mois_concerne?: string
          montant?: number
          statut?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "paiements_enfant_id_fkey"
            columns: ["enfant_id"]
            isOneToOne: false
            referencedRelation: "enfants"
            referencedColumns: ["id"]
          },
        ]
      }
      paiements_inscription: {
        Row: {
          date_paiement: string | null
          enfant_id: number | null
          id: number
          methode_paiement: string | null
          montant: number
        }
        Insert: {
          date_paiement?: string | null
          enfant_id?: number | null
          id?: number
          methode_paiement?: string | null
          montant: number
        }
        Update: {
          date_paiement?: string | null
          enfant_id?: number | null
          id?: number
          methode_paiement?: string | null
          montant?: number
        }
        Relationships: [
          {
            foreignKeyName: "paiements_inscription_enfant_id_fkey"
            columns: ["enfant_id"]
            isOneToOne: false
            referencedRelation: "enfants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
