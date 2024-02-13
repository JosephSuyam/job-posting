import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  UUIDV4
} from 'sequelize';
import sequelizeConnection from '.';
import { DepartmentList, EmploymentType, JobStatus } from './enums/jobs.enum';

export type JobAttributes = {
  id?: string;
  title: string;
  company: string;
  location: string;
  department: string;
  employment_type: string;
  description: string;
  status: string;
  created_at?: Date;
  updated_at?: Date;
}

class Jobs extends Model<InferAttributes<Jobs>, InferCreationAttributes<Jobs>> implements JobAttributes {
  declare id: CreationOptional<string>;
  declare title: string;
  declare company: string;
  declare location: string;
  declare department: string;
  declare employment_type: string;
  declare description: string;
  declare status: CreationOptional<string>;
  declare created_at?: CreationOptional<Date>;
  declare updated_at?: CreationOptional<Date>;
}

Jobs.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: UUIDV4
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    company: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    location: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    department: {
      allowNull: false,
      type: DataTypes.ENUM(...Object.values(DepartmentList)),
    },
    employment_type: {
      allowNull: false,
      type: DataTypes.ENUM(...Object.values(EmploymentType)),
      defaultValue: EmploymentType.FULLTIME,
    },
    description: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    status: {
      allowNull: false,
      type: DataTypes.ENUM(...Object.values(JobStatus)),
      defaultValue: JobStatus.PENDING,
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: 'Jobs',
    tableName: 'jobs',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    timestamps: true
  }
);

export default Jobs;
