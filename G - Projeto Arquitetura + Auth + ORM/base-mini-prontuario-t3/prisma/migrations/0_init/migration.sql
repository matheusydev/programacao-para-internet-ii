-- CreateTable
CREATE TABLE "patients" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "birth_date" TEXT NOT NULL,
    "national_id" TEXT NOT NULL,
    "photo_url" TEXT,
    "active" INTEGER NOT NULL DEFAULT 1
);

-- CreateTable
CREATE TABLE "encounters" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patient_id" INTEGER NOT NULL,
    "started_at" TEXT NOT NULL,
    "chief_complaint" TEXT NOT NULL,
    "notes" TEXT,
    CONSTRAINT "encounters_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "medication_requests" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "encounter_id" INTEGER NOT NULL,
    "medication" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    CONSTRAINT "medication_requests_encounter_id_fkey" FOREIGN KEY ("encounter_id") REFERENCES "encounters" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_patients_1" ON "patients"("national_id");
Pragma writable_schema=0;

-- CreateIndex
CREATE INDEX "idx_encounters_patient" ON "encounters"("patient_id");

-- CreateIndex
CREATE INDEX "idx_medreq_encounter" ON "medication_requests"("encounter_id");

