import { CalibrationService } from './calibration.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { CatatHasilDto } from './dto/catat-hasil.dto';
import { TinjauHasilDto } from './dto/tinjau-hasil.dto';
import type { RequestUser } from '../common/decorators/current-user.decorator';
import { CreateCalibrationParameterDto } from './dto/create-parameter.dto';
import { UpdateCalibrationParameterDto } from './dto/update-parameter.dto';
import { AssetKategori } from '../assets/enums/asset-status.enum';
export declare class CalibrationController {
    private readonly calibrationService;
    constructor(calibrationService: CalibrationService);
    findParameters(kategori?: AssetKategori, includeInactive?: string): Promise<import("./calibration-parameter.entity").CalibrationParameter[]>;
    createParameter(dto: CreateCalibrationParameterDto, user: RequestUser): Promise<import("./calibration-parameter.entity").CalibrationParameter>;
    updateParameter(id: string, dto: UpdateCalibrationParameterDto, user: RequestUser): Promise<import("./calibration-parameter.entity").CalibrationParameter>;
    findAllSchedules(): Promise<import("./calibration-schedule.entity").CalibrationSchedule[]>;
    findSchedule(id: string): Promise<import("./calibration-schedule.entity").CalibrationSchedule>;
    createSchedule(dto: CreateScheduleDto, user: RequestUser): Promise<import("./calibration-schedule.entity").CalibrationSchedule>;
    refreshStatusJadwal(id: string): Promise<import("./calibration-schedule.entity").CalibrationSchedule>;
    selesaikanPerbaikan(id: string, user: RequestUser): Promise<import("./calibration-schedule.entity").CalibrationSchedule>;
    findLog(id: string): Promise<import("./calibration-log.entity").CalibrationLog>;
    findLogsBySchedule(scheduleId: string): Promise<import("./calibration-log.entity").CalibrationLog[]>;
    catatHasil(scheduleId: string, dto: CatatHasilDto, user: RequestUser): Promise<import("./calibration-log.entity").CalibrationLog>;
    tinjauHasil(id: string, dto: TinjauHasilDto, user: RequestUser): Promise<import("./calibration-log.entity").CalibrationLog>;
}
