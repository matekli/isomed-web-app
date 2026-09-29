-- CreateTable
CREATE TABLE "patient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "birthday" DATETIME,
    "height" INTEGER,
    "sex" TEXT
);

-- CreateTable
CREATE TABLE "examination" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "datetime" DATETIME,
    "joint_side" TEXT,
    "test_mode" TEXT,
    "joint" TEXT,
    "plane" TEXT,
    "grafity_compensation" TEXT,
    "motion_start" INTEGER,
    "motion_end" INTEGER,
    "speed_1" INTEGER,
    "speed_2" INTEGER,
    "break" INTEGER,
    "start_hold_position" INTEGER,
    "end_hold_position" INTEGER,
    "hold_time" INTEGER,
    "number_of_sets" INTEGER,
    "number_of_repetitions" INTEGER,
    "weight" INTEGER,
    "height" INTEGER,
    CONSTRAINT "examination_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "measurement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "time" INTEGER,
    "relative_position" INTEGER,
    "torque" INTEGER,
    "speed" INTEGER,
    "torque_without_g_calibration" INTEGER,
    "current_repetition" INTEGER,
    "current_set" INTEGER,
    "torque_on_dynamometer" INTEGER,
    "force_on_right_leg" INTEGER,
    "force_on_left_leg" INTEGER,
    "examination_id" TEXT NOT NULL,
    CONSTRAINT "measurement_examination_id_fkey" FOREIGN KEY ("examination_id") REFERENCES "examination" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "examination_group_membership" (
    "item_id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,

    PRIMARY KEY ("item_id", "group_id"),
    CONSTRAINT "examination_group_membership_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "examination" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "examination_group_membership_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "examination_group" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "examination_group" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "patient_group_membership" (
    "item_id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,

    PRIMARY KEY ("item_id", "group_id"),
    CONSTRAINT "patient_group_membership_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "patient_group_membership_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "patient_group" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "patient_group" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "patient_weights" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "weight" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "patient_id" TEXT NOT NULL,
    CONSTRAINT "patient_weights_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "comparison" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT,
    "title" TEXT,
    "onlyIsokinetic" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comment" TEXT,
    "paramsJson" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "patient_firstname_lastname_key" ON "patient"("firstname", "lastname");

-- CreateIndex
CREATE UNIQUE INDEX "examination_id_key" ON "examination"("id");

-- CreateIndex
CREATE UNIQUE INDEX "examination_group_name_key" ON "examination_group"("name");

-- CreateIndex
CREATE UNIQUE INDEX "patient_group_name_key" ON "patient_group"("name");

-- CreateIndex
CREATE UNIQUE INDEX "patient_weights_patient_id_date_weight_key" ON "patient_weights"("patient_id", "date", "weight");
