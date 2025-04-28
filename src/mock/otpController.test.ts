// import otpController from "../controllers/otp.controller";
// import otpService from "../services/otp.service";
// import userService from "../services/user.service";
// import { Request, Response, NextFunction } from "express";

// // Mock the services
// jest.mock("../services/otp.service");
// jest.mock("../services/user.service");

// describe("OTP Controller Tests", () => {
//   const mockUserId = "testUserId";

//   // Mock request, response, and next function
//   const mockReq = {
//     userId: mockUserId,
//     body: { otp: "123456" },
//   } as unknown as Request;
//   const mockRes = {
//     status: jest.fn().mockReturnThis(),
//     json: jest.fn(),
//   } as unknown as Response;
//   const mockNext = jest.fn() as NextFunction;

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe("generateOtp", () => {
//     it("should return 404 if user is not found", async () => {
//       (userService.getById as jest.Mock).mockResolvedValue(null);

//       await otpController.generateOtp(mockReq, mockRes, mockNext);

//       expect(mockRes.status).toHaveBeenCalledWith(404);
//       expect(mockRes.json).toHaveBeenCalledWith({ message: "User not found" });
//     });

//     it("should return 400 if user is already verified", async () => {
//       (userService.getById as jest.Mock).mockResolvedValue({
//         isVerified: true,
//       });

//       await otpController.generateOtp(mockReq, mockRes, mockNext);

//       expect(mockRes.status).toHaveBeenCalledWith(400);
//       expect(mockRes.json).toHaveBeenCalledWith({
//         message: "User is already verified",
//       });
//     });

//     it("should return 200 and OTP if OTP is generated successfully", async () => {
//       (userService.getById as jest.Mock).mockResolvedValue({
//         isVerified: false,
//         phoneNumber: "+2349128062479",
//       });
//       (otpService.generateOtp as jest.Mock).mockResolvedValue("mockOtp");

//       await otpController.generateOtp(mockReq, mockRes, mockNext);

//       expect(mockRes.status).toHaveBeenCalledWith(200);
//       expect(mockRes.json).toHaveBeenCalledWith({
//         message: "OTP sent successfully",
//         otp: "mockOtp",
//       });
//     });
//   });

//   describe("verifyOtp", () => {
//     it("should return 400 if OTP is invalid", async () => {
//       (otpService.verifyOtp as jest.Mock).mockResolvedValue(false);

//       await otpController.verifyOtp(mockReq, mockRes, mockNext);

//       expect(mockRes.status).toHaveBeenCalledWith(400);
//       expect(mockRes.json).toHaveBeenCalledWith({
//         message: "Invalid or expired OTP",
//       });
//     });

//     it("should return 200 if OTP is valid and user is verified successfully", async () => {
//       (otpService.verifyOtp as jest.Mock).mockResolvedValue(true);
//       (userService.editUser as jest.Mock).mockResolvedValue({});

//       await otpController.verifyOtp(mockReq, mockRes, mockNext);

//       expect(mockRes.status).toHaveBeenCalledWith(200);
//       expect(mockRes.json).toHaveBeenCalledWith({
//         message: "User verified successfully",
//       });
//     });
//   });

//   describe("resendOtp", () => {
//     it("should return 404 if user is not found", async () => {
//       (userService.getById as jest.Mock).mockResolvedValue(null);

//       await otpController.resendOtp(mockReq, mockRes, mockNext);

//       expect(mockRes.status).toHaveBeenCalledWith(404);
//       expect(mockRes.json).toHaveBeenCalledWith({ message: "User not found" });
//     });

//     it("should return 400 if user is already verified", async () => {
//       (userService.getById as jest.Mock).mockResolvedValue({
//         isVerified: true,
//       });

//       await otpController.resendOtp(mockReq, mockRes, mockNext);

//       expect(mockRes.status).toHaveBeenCalledWith(400);
//       expect(mockRes.json).toHaveBeenCalledWith({
//         message: "User is already verified",
//       });
//     });

//     it("should return 200 and OTP if OTP is resent successfully", async () => {
//       (userService.getById as jest.Mock).mockResolvedValue({
//         isVerified: false,
//         phoneNumber: "+2348161327903",
//       });
//       (otpService.generateOtp as jest.Mock).mockResolvedValue("mockOtp");

//       await otpController.resendOtp(mockReq, mockRes, mockNext);

//       expect(mockRes.status).toHaveBeenCalledWith(200);
//       expect(mockRes.json).toHaveBeenCalledWith({
//         message: "OTP resent successfully",
//         otp: "mockOtp",
//       });
//     });
//   });
// });
