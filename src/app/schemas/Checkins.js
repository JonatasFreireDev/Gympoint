import mongoose from 'mongoose';

const CheckinsSchema = new mongoose.Schema(
  {
    student_id: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Checkins', CheckinsSchema);
