%% Mermaid ER diagram for RencontrAir MVP
%% Derived from chiffrage.csv user stories (BackOffice & AppMobile)

erDiagram
    ACCOUNT {
        string id
        string email
        string password_hash
        string role "ADMIN|OWNER|USER"
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    USER_PROFILE {
        string id
        string account_id
        string first_name
        string last_name
        int age
        string interests  "CSV or JSON array"
        string avatar_url
        datetime created_at
        datetime updated_at
    }

    PARTNER_REGISTRATION_REQUEST {
        string id
        string first_name
        string last_name
        string email
        string phone
        string role "OWNER|MANAGER|STAFF"
        json establishment "Google Places API data"
        string status "PENDING|APPROVED|REJECTED"
        text admin_notes
        string rejection_reason
        string processed_by_admin_id
        datetime created_at
        datetime processed_at
    }

    ESTABLISHMENT {
        string id
        string name
        string type "PLACE|EVENT"
        string address
        float latitude
        float longitude
        json google_places_data "Complete Google Places info"
        boolean is_partner
        string offer "STANDARD|PREMIUM"
        string owner_account_id
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    MEMBERSHIP {
        string id
        string account_id
        string establishment_id
        date start_date
        date end_date
        string status "ACTIVE|PAST|CANCELLED"
        datetime created_at
        datetime updated_at
    }

    QR_CODE {
        string id
        string establishment_id
        string deep_link "app://etablissement/{id}"
        string image_url
        boolean is_active
        datetime created_at
    }

    CHAT_CHANNEL {
        string id
        string establishment_id
        string type "GENERAL|PRIVATE|PREMIUM_GROUP"
        string created_by_account_id
        datetime created_at
    }

    CHAT_MEMBERSHIP {
        string channel_id
        string account_id
        datetime joined_at
    }

    MESSAGE {
        string id
        string channel_id
        string author_account_id
        string body
        string message_type "USER_MESSAGE|OWNER_MESSAGE|COMMUNICATION"
        json metadata "Extra data for communications (title, image, etc.)"
        boolean is_blocked
        boolean is_pinned
        datetime created_at
    }

    NOTIFICATION_CAMPAIGN {
        string id
        string establishment_id
        string title
        string body
        date target_start_date
        date target_end_date
        string status "DRAFT|SENT|CANCELLED"
        string created_by_account_id
        datetime created_at
    }

    NOTIFICATION_DELIVERY {
        string id
        string campaign_id
        string account_id
        string status "PENDING|SENT|FAILED"
        datetime sent_at
    }

    OAUTH_ACCOUNT {
        string id
        string account_id
        string provider "APPLE|GOOGLE"
        string provider_user_id
        datetime created_at
    }

    %% Relationships
    ACCOUNT ||--|| USER_PROFILE : has
    ACCOUNT ||--o{ ESTABLISHMENT : owns
    ACCOUNT ||--o{ MEMBERSHIP : joins
    ACCOUNT ||--o{ CHAT_MEMBERSHIP : joins
    ACCOUNT ||--o{ PARTNER_REGISTRATION_REQUEST : processes
    PARTNER_REGISTRATION_REQUEST ||--o| ESTABLISHMENT : creates
    ESTABLISHMENT ||--o{ MEMBERSHIP : has
    ESTABLISHMENT ||--o{ QR_CODE : generates
    ESTABLISHMENT ||--o{ CHAT_CHANNEL : hosts
    CHAT_CHANNEL ||--o{ MESSAGE : contains
    ACCOUNT ||--o{ CHAT_MEMBERSHIP : participates
    CHAT_CHANNEL ||--o{ CHAT_MEMBERSHIP : has
    ACCOUNT ||--o{ OAUTH_ACCOUNT : links
    ESTABLISHMENT ||--o{ NOTIFICATION_CAMPAIGN : schedules
    NOTIFICATION_CAMPAIGN ||--o{ NOTIFICATION_DELIVERY : produces
    ACCOUNT ||--o{ NOTIFICATION_DELIVERY : receives

    %% Notes:
    %% - GENERAL chat: one channel per establishment (enforced at app level).
    %% - PRIVATE chat: direct messaging between users.
    %% - PREMIUM_GROUP chat: exclusive to premium users of same establishment, owner excluded.
    %% - MEMBERSHIP dates must be in the future (no passées) for EVENT-type establishments.
    %% - Stats (nb utilisateurs actifs/proches) are computed, not stored.
    %% - PARTNER_REGISTRATION_REQUEST: workflow validation admin before ESTABLISHMENT creation
    %% - Google Places data stored in both registration request and final establishment
    %% - MESSAGE types: USER_MESSAGE (regular), OWNER_MESSAGE (from establishment owner), COMMUNICATION (official announcements)
    %% - COMMUNICATION messages have special metadata (title, images) and can be pinned
