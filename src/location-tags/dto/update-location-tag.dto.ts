import { PartialType } from '@nestjs/swagger';
import { CreateLocationTagDto } from './create-location-tag.dto';

export class UpdateLocationTagDto extends PartialType(CreateLocationTagDto) {}
