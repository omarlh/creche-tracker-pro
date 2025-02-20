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
          classe: string | null
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
          classe?: string | null
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
          classe?: string | null
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
          enfant_id: number | null
          id: number
          methode_paiement: string | null
          mois_concerne: string
          montant: number
          statut: string | null
          type_paiement: string | null
        }
        Insert: {
          annee_scolaire?: string | null
          commentaire?: string | null
          created_at?: string | null
          date_paiement?: string | null
          enfant_id?: number | null
          id?: number
          methode_paiement?: string | null
          mois_concerne: string
          montant: number
          statut?: string | null
          type_paiement?: string | null
        }
        Update: {
          annee_scolaire?: string | null
          commentaire?: string | null
          created_at?: string | null
          date_paiement?: string | null
          enfant_id?: number | null
          id?: number
          methode_paiement?: string | null
          mois_concerne?: string
          montant?: number
          statut?: string | null
          type_paiement?: string | null
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
