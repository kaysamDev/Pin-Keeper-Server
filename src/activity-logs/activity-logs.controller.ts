import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ActivityLogsService } from './activity-logs.service';
import { ActivityLogs } from '../../generated/prisma/client';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../models/auth/auth.guard';

@ApiTags('activity-logs')
@ApiBearerAuth()
@Controller('activity-logs')
@UseGuards(AuthGuard)
export class ActivityLogsController {
  constructor(private activityLogsService: ActivityLogsService) {}

  @ApiOperation({ summary: 'Get all activity logs' })
  @ApiResponse({ status: 200, description: 'Activity Logs Found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @Get()
  async getActivityLogs(): Promise<ActivityLogs[] | null> {
    return await this.activityLogsService.getActivityLogs({
      orderBy: { createdAt: 'desc' },
    });
  }

  @ApiOperation({ summary: 'Get activity log by ID' })
  @ApiResponse({ status: 200, description: 'Activity Log Found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @Get('activity-log/:id')
  async getActivityLogById(
    @Param('id') id: string,
  ): Promise<ActivityLogs | null> {
    return await this.activityLogsService.getActivityLog({ id: Number(id) });
  }

  @ApiOperation({ summary: 'Get activity logs by user ID' })
  @ApiResponse({ status: 200, description: 'Activity Logs Found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @Get('user/:userId')
  async getActivityLogsByUserId(
    @Param('userId') userId: string,
  ): Promise<ActivityLogs[] | null> {
    return await this.activityLogsService.getActivityLogsByUserId(
      Number(userId),
    );
  }

  @ApiOperation({ summary: 'Create activity log' })
  @ApiResponse({ status: 201, description: 'Activity Log Created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createActivityLog(@Body() createActivityLogDto: CreateActivityLogDto) {
    const { userId, action, metadata } = createActivityLogDto;
    return this.activityLogsService.createActivityLog({
      action,
      metadata,
      user: {
        connect: { id: userId },
      },
    });
  }
}
