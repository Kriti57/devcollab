import mongoose, {Document, Schema} from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the User interface for TypeScript
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
  skills: string[];
  githubId?: string;
  githubUsername?: string;
  repos?: any[];
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema: Schema = new Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique:  true,
            trim: true,
            minlength: [3, 'Username must be atleast 3 characters'],
            maxlength: [30, 'Username cannot exceed 30 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email',
            ],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be atleast 6 characters'],
            select: false,
        },
        avatar: {
            type: String,
            default: 'https://via.placeholder.com/150',
        },

        bio: {
            type: String,
            maxlength: [500, 'Bio cannot exceed 500 characters'],
        },
        skills: {
            type: [String],
            default: [],
        },
            githubId: {
            type: String,
        },
            githubUsername: {
            type: String,
        },
            repos: {
            type: Array,
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  // @ts-ignore
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
