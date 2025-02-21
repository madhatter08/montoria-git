const mongoose = require("mongoose");

// Import all models
const User = require("./userModel");
const Admin = require("./adminModel");
const Student = require("./studentModel");
const Parent = require("./parentModel");
const Guide = require("./guideModel");
const Class = require("./classModel");
const Schedule = require("./scheduleModel");
const Attendance = require("./attendanceModel");
const Program = require("./programModel");
const Level = require("./levelModel");
const Area = require("./areaModel");
const Lesson = require("./lessonModel");
const Work = require("./workModel");
const Material = require("./materialModel");
const Event = require("./eventModel");
const Notification = require("./notificationModel");
const StudentProgress = require("./studentProgressModel");
const Chatbot = require("./chatbotModel");
const Curriculum = require("./curriculumModel");

module.exports = {
  User,
  Admin,
  Student,
  Parent,
  Guide,
  Class,
  Schedule,
  Attendance,
  Program,
  Level,
  Area,
  Lesson,
  Work,
  Material,
  Event,
  Notification,
  StudentProgress,
  Chatbot,
  Curriculum,
};

/* How to use and import models to other files */
// const { User, Student, Class } = require("../models");
