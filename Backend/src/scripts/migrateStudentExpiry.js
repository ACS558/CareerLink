import mongoose from "mongoose";
import dotenv from "dotenv";
import Student from "../models/Student.js";

dotenv.config();

const migrateStudents = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const students = await Student.find({
      $or: [{ expiryDate: { $exists: false } }, { expiryDate: null }],
    });

    console.log(`📊 Found ${students.length} students to migrate`);

    let migrated = 0;

    for (const student of students) {
      const regDate = student.createdAt || new Date();

      const guidanceStart = new Date(regDate);
      guidanceStart.setDate(guidanceStart.getDate() + 365);

      const expiry = new Date(regDate);
      expiry.setDate(expiry.getDate() + 375);

      const deletion = new Date(expiry);
      deletion.setDate(deletion.getDate() + 90);

      // ✅ Use updateOne to bypass middleware
      await Student.updateOne(
        { _id: student._id },
        {
          $set: {
            registrationDate: regDate,
            careerGuidanceStartDate: guidanceStart,
            expiryDate: expiry,
            deletionScheduledAt: deletion,
            accountStatus: "active",
            isDeleted: false,
          },
        },
      );

      migrated++;

      if (migrated % 100 === 0) {
        console.log(`⏳ Migrated ${migrated}/${students.length}...`);
      }
    }

    console.log(`✅ Migration complete! Migrated ${migrated} students`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

migrateStudents();
