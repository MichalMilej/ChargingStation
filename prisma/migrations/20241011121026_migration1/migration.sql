-- CreateEnum
CREATE TYPE "current_type" AS ENUM ('AC', 'DC');

-- CreateTable
CREATE TABLE "charging_station_type" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "plug_count" INTEGER NOT NULL,
    "efficiency" DOUBLE PRECISION NOT NULL,
    "currentType" "current_type" NOT NULL,

    CONSTRAINT "charging_station_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "connector" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "priority" BOOLEAN NOT NULL DEFAULT false,
    "chargingStationId" UUID,

    CONSTRAINT "connector_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "charging_station" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "device_id" UUID NOT NULL,
    "ip_address" INET NOT NULL,
    "firmware_version" TEXT NOT NULL,
    "chargingStationTypeId" UUID NOT NULL,

    CONSTRAINT "charging_station_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "charging_station_type_name_key" ON "charging_station_type"("name");

-- CreateIndex
CREATE UNIQUE INDEX "charging_station_name_key" ON "charging_station"("name");

-- CreateIndex
CREATE UNIQUE INDEX "charging_station_device_id_key" ON "charging_station"("device_id");

-- AddForeignKey
ALTER TABLE "connector" ADD CONSTRAINT "connector_chargingStationId_fkey" FOREIGN KEY ("chargingStationId") REFERENCES "charging_station"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "charging_station" ADD CONSTRAINT "charging_station_chargingStationTypeId_fkey" FOREIGN KEY ("chargingStationTypeId") REFERENCES "charging_station_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
