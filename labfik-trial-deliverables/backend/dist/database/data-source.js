"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const node_path_1 = require("node:path");
const typeorm_1 = require("typeorm");
const asset_entity_1 = require("../assets/asset.entity");
const item_configuration_change_entity_1 = require("../audit/item-configuration-change.entity");
const calibration_log_entity_1 = require("../calibration/calibration-log.entity");
const calibration_schedule_entity_1 = require("../calibration/calibration-schedule.entity");
const calibration_parameter_entity_1 = require("../calibration/calibration-parameter.entity");
const work_order_entity_1 = require("../maintenance/work-order.entity");
const stock_opname_period_entity_1 = require("../stock-opname/stock-opname-period.entity");
const stock_opname_record_entity_1 = require("../stock-opname/stock-opname-record.entity");
const user_entity_1 = require("../users/user.entity");
const vendor_entity_1 = require("../vendors/vendor.entity");
exports.default = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    database: process.env.DB_NAME ?? 'labfik_inventory',
    entities: [
        user_entity_1.User,
        asset_entity_1.Asset,
        item_configuration_change_entity_1.ItemConfigurationChange,
        work_order_entity_1.WorkOrder,
        stock_opname_period_entity_1.StockOpnamePeriod,
        stock_opname_record_entity_1.StockOpnameRecord,
        calibration_schedule_entity_1.CalibrationSchedule,
        calibration_log_entity_1.CalibrationLog,
        calibration_parameter_entity_1.CalibrationParameter,
        vendor_entity_1.Vendor,
    ],
    migrations: [(0, node_path_1.join)(__dirname, 'migrations/*{.ts,.js}')],
    synchronize: false,
});
//# sourceMappingURL=data-source.js.map