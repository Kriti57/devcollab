import mongoose, {Document, Schema} from 'mongoose';
export interface IProject extends Document {
  name: string;
  description: string;
  techStack: string[];
  creator: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  lookingFor: string[];
  repositoryUrl?: string;
  liveUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      minlength: [3, 'Project name must be atleast 3 characters'],
      maxlength: [100, 'Project name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      minlength: [10, 'Description must be atleast 10 characters'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    techStack: {
      type: [String],
      required: [true, 'Tech stack is required'],
      validate: {
        validator: function (arr: string[]) {
          return arr.length > 0;
        },
        message: 'Atleast one technology is required',
      },
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      enum: ['planning', 'active', 'completed', 'on-hold'],
      default: 'planning',
    },
    lookingFor: {
      type: [String],
      default: [],
    },
    repositoryUrl: {
      type: String,
      match: [
        /^https?:\/\/(www\.)?github\.com\/.+/,
        'Please provide a valid GitHub URL'
      ],
    },
    liveUrl: {
      type: String,
      match: [/^https?:\/\/.+/, 'Please provide a valid URL'],
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model<IProject>('Project', projectSchema);

export default Project;