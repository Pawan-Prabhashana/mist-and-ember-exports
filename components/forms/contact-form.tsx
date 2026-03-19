"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";

type FormValues = {
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  product: string;
  quantity: string;
  message: string;
  attachment?: FileList;
  website?: string; // honeypot
};

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onSubmit = async (data: FormValues) => {
    setStatus("idle");
    setErrorMsg(null);

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "attachment" && value instanceof FileList && value[0]) {
          formData.append(key, value[0]);
        } else if (typeof value === "string") {
          formData.append(key, value);
        }
      });

      const res = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok || !json.ok) {
        setStatus("error");
        setErrorMsg(json.error || "Failed to send message. Please try again.");
        return;
      }

      setStatus("success");
      reset();
    } catch (err) {
      console.error("[contact-form] error:", err);
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-3xl rounded-2xl border border-[#E7E3DE] bg-white p-8 shadow-sm"
    >
      <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-6 text-center">
        Get in Touch
      </h2>

      {/* Success message */}
      {status === "success" && (
        <div className="mb-6 rounded-xl border border-green-500 bg-green-50 p-4 text-sm text-green-700">
          Thank you! Your message has been sent successfully.
        </div>
      )}

      {/* Error message */}
      {status === "error" && (
        <div className="mb-6 rounded-xl border border-red-500 bg-red-50 p-4 text-sm text-red-700">
          {errorMsg || "Something went wrong. Please try again."}
        </div>
      )}

      {/* Grid of inputs */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-1">Name *</label>
          <input
            type="text"
            {...register("name", { required: true })}
            className="w-full rounded-xl border border-[#E7E3DE] px-4 py-2.5 text-sm outline-none focus:border-[#C4A36A]"
          />
          {errors.name && (
            <p className="text-xs text-red-600 mt-1">Name is required</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Company</label>
          <input
            type="text"
            {...register("company")}
            className="w-full rounded-xl border border-[#E7E3DE] px-4 py-2.5 text-sm outline-none focus:border-[#C4A36A]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email *</label>
          <input
            type="email"
            {...register("email", { required: true })}
            className="w-full rounded-xl border border-[#E7E3DE] px-4 py-2.5 text-sm outline-none focus:border-[#C4A36A]"
          />
          {errors.email && (
            <p className="text-xs text-red-600 mt-1">Valid email required</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="tel"
            {...register("phone")}
            className="w-full rounded-xl border border-[#E7E3DE] px-4 py-2.5 text-sm outline-none focus:border-[#C4A36A]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Country</label>
          <input
            type="text"
            {...register("country")}
            className="w-full rounded-xl border border-[#E7E3DE] px-4 py-2.5 text-sm outline-none focus:border-[#C4A36A]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Product of Interest *
          </label>
          <input
            type="text"
            {...register("product", { required: true })}
            className="w-full rounded-xl border border-[#E7E3DE] px-4 py-2.5 text-sm outline-none focus:border-[#C4A36A]"
          />
          {errors.product && (
            <p className="text-xs text-red-600 mt-1">Product is required</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Quantity / Order Size
          </label>
          <input
            type="text"
            {...register("quantity")}
            className="w-full rounded-xl border border-[#E7E3DE] px-4 py-2.5 text-sm outline-none focus:border-[#C4A36A]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Attachment (optional)
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            {...register("attachment")}
            className="block w-full text-sm text-[#4B5A56] file:mr-3 file:rounded-lg file:border-0 file:bg-[#083335] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:opacity-90"
          />
        </div>
      </div>

      {/* Message */}
      <div className="mt-4">
        <label className="block text-sm font-medium mb-1">Message *</label>
        <textarea
          rows={5}
          {...register("message", { required: true })}
          className="w-full rounded-xl border border-[#E7E3DE] px-4 py-2.5 text-sm outline-none focus:border-[#C4A36A] resize-none"
        />
        {errors.message && (
          <p className="text-xs text-red-600 mt-1">Message is required</p>
        )}
      </div>

      {/* Honeypot field */}
      <input
        type="text"
        {...register("website")}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      {/* Submit */}
      <div className="mt-6 flex justify-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-[#083335] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </div>

      <p className="mt-6 text-xs text-center text-[#4B5A56]">
        By submitting this form, you agree to our{" "}
        <a
          href="/legal/privacy"
          className="underline decoration-[#C4A36A]/70 underline-offset-2 hover:text-[#B07C4F]"
        >
          Privacy Policy
        </a>
        .
      </p>
    </motion.form>
  );
}
