import { IsIn, IsInt, Max, Min } from 'class-validator';
import { ControlMode, TrolleySpeed } from '@crane/common';

export class LevelDto {
  @IsInt()
  @Min(0)
  @Max(254)
  level254!: number;
}

export class TrolleySpeedDto {
  @IsIn(['slow', 'medium', 'fast'])
  speed!: TrolleySpeed;
}

export class ControlModeDto {
  @IsIn(['quay', 'manual'])
  mode!: ControlMode;
}


export class AddressDto {
  @IsInt()
  @Min(0)
  @Max(63)
  address!: number;
}

export class AddressLevelDto extends AddressDto {
  @IsInt()
  @Min(0)
  @Max(254)
  level254!: number;
}

