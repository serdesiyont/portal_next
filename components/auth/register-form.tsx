/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { useState, useEffect } from "react";
// import { registerUser } from "@/app/api/users/register";
import {
  CheckCircle,
  Loader2,
  User,
  Mail,
  Venus,
  Mars,
  Briefcase,
  FileText,
  Phone,
  X,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
// @ts-expect-error
import confetti from "canvas-confetti";
import ProgressBar from "@/components/ui/progress-bar";
import Link from "next/link";
import { register } from "@/app/api/users/register";

const PRIMARY_COLOR = "var(--primary)"; // Linked to index.css
const SECONDARY_COLOR = "var(--chart-2)"; // Linked to index.css
const DISABLED_COLOR = "var(--muted)"; // Linked to index.css

// Refactor VerifyEmailText to simulate OTP sending and verification
const VerifyEmailText = ({
  email,
  onVerified,
  isVerified,
}: {
  email: string;
  onVerified: () => void;
  isVerified: boolean;
}) => {
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const isValidEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleSendOtp = async () => {
    if (!isValidEmail(email)) return;
    setIsSendingOtp(true);
    try {
      // Simulate OTP sending
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setShowOtpPopup(true);
      setResendCooldown(30);
      setError("");
    } catch {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otpValue.length !== 6) return;
    setLoading(true);
    try {
      // Simulate OTP verification
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (otpValue === "123456") {
        onVerified();
        setShowOtpPopup(false);
      } else {
        setError("Invalid OTP code. Try again.");
      }
    } catch {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative mt-2">
      <span
        onClick={!isVerified ? handleSendOtp : undefined}
        className={`cursor-pointer text-sm font-medium ${
          isValidEmail(email) && !isVerified
            ? "text-[#10B981]"
            : "text-gray-400"
        } ${isSendingOtp ? "opacity-70" : ""}`}
      >
        {isVerified ? (
          <span className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            Email Verified
          </span>
        ) : isSendingOtp ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          "Verify Email"
        )}
      </span>

      <AnimatePresence>
        {showOtpPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Verify OTP</h3>
                <button
                  onClick={() => setShowOtpPopup(false)}
                  className="text-[#1E293B]/50 hover:text-[#1E293B]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-[#1E293B]/80 mb-2">
                Enter the 6-digit code sent to {email}
              </p>

              {error && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md mb-4 text-sm">
                  {error}
                </div>
              )}

              <Input
                value={otpValue}
                onChange={(e) => {
                  setOtpValue(e.target.value.replace(/\D/g, "").slice(0, 6));
                  if (error) setError("");
                }}
                placeholder="••••••"
                className="mb-4 text-center tracking-[0.5em] font-mono text-xl"
                maxLength={6}
              />

              <Button
                onClick={handleVerifyOtp}
                className="w-full"
                disabled={loading || otpValue.length !== 6}
              >
                {loading ? "Verifying..." : "Verify"}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_num: "",
    gender: "",
    division: "",
    additional: "",
  });

  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [touchedFields, setTouchedFields] = useState({
    email: false,
    phone_num: false,
  });

  const isValidEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);

  const isFormValid = () => {
    return (
      formData.name &&
      isValidEmail(formData.email) &&
      formData.phone_num &&
      formData.gender &&
      formData.division &&
      formData.additional
    );
  };

  const handlePhoneChange = (value: string) => {
    setFormData({ ...formData, phone_num: value });
    setTouchedFields({ ...touchedFields, phone_num: true });
  };

  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        window.location.href = "/";
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted]);

  useEffect(() => {
    setIsEmailVerified(false);
  }, [formData.email]);

  async function registerAction(formData: {
    name: string;
    email: string;
    phone_num: string;
    gender: string;
    division: string;
    additional: string;
  }) {
    const res = await register(formData);
    let data;
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      data = await res.text();
    }
    if (!res.ok) {
      if (res.status === 409) {
        throw new Error("Email already used");
      }
      if (typeof data === "object" && data.error) {
        throw new Error(data.error);
      } else {
        throw new Error(
          typeof data === "string" ? data : "Registration failed"
        );
      }
    }
    console.log(data)
    return data;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setUploadProgress(30);

    if (!isFormValid()) {
      setError("Please fill out all required fields.");
      setLoading(false);
      return;
    }

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      // Use server action for registration
      await registerAction(formData);

      clearInterval(progressInterval);
      setUploadProgress(100);
      setIsSubmitted(true);

      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: [PRIMARY_COLOR, SECONDARY_COLOR],
        scalar: 1.2,
      });
    } catch (err) {
      console.error("Error caught in handleSubmit:", err);
      setError(err instanceof Error ? err.message : "Application failed");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };
  return (
    <>
      <div className="absolute top-4 left-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-[#1E293B] hover:text-[#10B981]"
        >
          <Home className="w-5 h-5" />
          <span className="text-sm font-medium">Home</span>
        </Link>
      </div>
      <Card className="p-8 h-fit sticky top-20 border border-[#1E293B]/20 shadow-2xl">
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <h2
                  className="text-2xl font-bold mb-2"
                  style={{ color: PRIMARY_COLOR }}
                >
                  Register
                </h2>
                <p className="text-[#1E293B]/80">
                  Complete the form below to submit your application
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <Label className="flex items-center gap-2 text-sm font-medium mb-2">
                        <User className="w-4 h-4 text-[#1E293B]" />
                        Full Name
                      </Label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            name: e.target.value,
                          })
                        }
                        className="focus:ring-2 focus:ring-[#10B981]/50 border-[#1E293B]/30"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm font-medium">
                        <Mail className="w-4 h-4 text-[#1E293B]" />
                        Email Address
                      </Label>

                      {isValidEmail(formData.email) && (
                        <VerifyEmailText
                          email={formData.email}
                          onVerified={() => setIsEmailVerified(true)}
                          isVerified={isEmailVerified}
                        />
                      )}

                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          setTouchedFields({ ...touchedFields, email: true });
                        }}
                        className={`focus:ring-2 focus:ring-[#10B981]/50 border-[#1E293B]/30 ${
                          touchedFields.email && !isValidEmail(formData.email)
                            ? "border-red-500"
                            : ""
                        }`}
                      />

                      {touchedFields.email && !isValidEmail(formData.email) && (
                        <p className="text-xs text-red-500">
                          Please enter a valid email address
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className="flex items-center gap-2 text-sm font-medium mb-2">
                        <Phone className="w-4 h-4 text-[#1E293B]" />
                        Phone Number
                      </Label>
                      <Input
                        type="tel"
                        required
                        value={formData.phone_num}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        placeholder="+251XXXXXXXXX"
                        className="focus:ring-2 focus:ring-[#10B981]/50 border-[#1E293B]/30"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm font-medium mb-2">
                        <Venus className="w-4 h-4 text-[#1E293B]" />
                        Gender
                      </Label>
                      <div className="flex gap-3">
                        <label className="flex-1">
                          <input
                            type="radio"
                            name="gender"
                            value="Female"
                            checked={formData.gender === "Female"}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                gender: e.target.value,
                              })
                            }
                            className="hidden peer"
                          />
                          <div className="w-full p-3 text-center border border-[#1E293B]/30 rounded-md peer-checked:border-[#10B981] peer-checked:bg-[#10B981]/10 transition-all cursor-pointer">
                            <div className="flex items-center justify-center gap-2">
                              <Venus className="w-5 h-5 text-[#1E293B] peer-checked:text-[#10B981]" />
                              <span className="text-sm text-[#1E293B]">
                                Female
                              </span>
                            </div>
                          </div>
                        </label>

                        <label className="flex-1">
                          <input
                            type="radio"
                            name="gender"
                            value="Male"
                            checked={formData.gender === "Male"}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                gender: e.target.value,
                              })
                            }
                            className="hidden peer"
                          />
                          <div className="w-full p-3 text-center border border-[#1E293B]/30 rounded-md peer-checked:border-[#10B981] peer-checked:bg-[#10B981]/10 transition-all cursor-pointer">
                            <div className="flex items-center justify-center gap-2">
                              <Mars className="w-5 h-5 text-[#1E293B] peer-checked:text-[#10B981]" />
                              <span className="text-sm text-[#1E293B]">
                                Male
                              </span>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div>
                      <Label className="flex items-center gap-2 text-sm font-medium mb-2">
                        <Briefcase className="w-4 h-4 text-[#1E293B]" />
                        Track
                      </Label>
                      <select
                        className="w-full border border-[#1E293B]/30 rounded-md px-3 py-2.5 bg-white text-[#1E293B]/90 focus:ring-2 focus:ring-[#10B981]/50"
                        value={formData.division}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            division: e.target.value,
                          })
                        }
                        required
                      >
                        <option value="" disabled>
                          Select track
                        </option>
                        <option value="Django">Django</option>
                        <option value="React">React</option>
                        <option value="Laravel">Laravel</option>
                        <option value="DSA">DSA</option>
                        <option value="Begineer">Begineer</option>
                        <option value="Flutter">Flutter</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <FileText className="w-4 h-4 text-[#1E293B]" />
                    Additional Information
                  </Label>
                  <textarea
                    className="border-2 border-dashed rounded-xl p-6 text-left cursor-pointer transition-all w-full h-32 focus:ring-2 focus:ring-[#10B981]/50 border-[#1E293B]/30"
                    value={formData.additional}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        additional: e.target.value,
                      })
                    }
                    placeholder="Provide any additional information here..."
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <div className="space-y-4">
                  {loading && (
                    <ProgressBar
                      value={uploadProgress}
                      color={SECONDARY_COLOR}
                      className="h-2 rounded-full"
                    />
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 transition-all font-medium rounded-lg"
                    style={{
                      backgroundColor: isFormValid()
                        ? SECONDARY_COLOR
                        : DISABLED_COLOR,
                      color: isFormValid() ? "white" : "#64748B",
                    }}
                    disabled={!isFormValid() || loading}
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center p-8 text-center"
            >
              <CheckCircle
                className="w-16 h-16 text-green-500 mb-4"
                strokeWidth={1.5}
              />
              <h3 className="text-2xl font-bold text-[#1E293B] mb-2">
                Application Submitted!
              </h3>
              <p className="text-[#1E293B]/80 mb-6">
                Thank you for applying. We'll review your application and get
                back to you soon.
              </p>
              <div className="w-full max-w-xs">
                <ProgressBar
                  value={100}
                  color={SECONDARY_COLOR}
                  className="h-2 rounded-full mb-4"
                />
                <p className="text-sm text-[#1E293B]/60">
                  Redirecting to homepage in 3 seconds...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </>
  );
}
