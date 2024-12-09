ALTER TABLE "gratitude_tag" DROP CONSTRAINT "gratitude_tag_gratitude_id_tag_id_pk";--> statement-breakpoint
ALTER TABLE "organization_person_role" DROP CONSTRAINT "organization_person_role_organization_id_person_id_role_id_pk";--> statement-breakpoint
ALTER TABLE "role_permission" DROP CONSTRAINT "role_permission_role_id_permission_id_pk";--> statement-breakpoint
ALTER TABLE "gratitude_tag" ADD COLUMN "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "organization_person_role" ADD COLUMN "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "role_permission" ADD COLUMN "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;