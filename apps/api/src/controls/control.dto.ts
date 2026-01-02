import { IsInt, Max, Min } from 'class-validator';

export class LevelDto {
  @IsInt()
  @Min(0)
  @Max(254)
  level254!: number;
}
