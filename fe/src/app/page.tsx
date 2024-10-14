"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import axios from "axios";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function Home() {
  const url : string = process.env.NEXT_PUBLIC_BACKEND_URL ? process.env.NEXT_PUBLIC_BACKEND_URL + "/api/users" : "http://localhost:8000/api/users";
  const handleSubmit = async (values: {
    name: string;
    identityNumber: string;
    email: string;
    birthDate: dayjs.Dayjs;
  }) => {
    try {
      const res = await axios.post(url, {
        name: values.name,
        identity_number: values.identityNumber.toString(),
        email: values.email,
        date_of_birth: values.birthDate.format("YYYY-MM-DD"),
      });
      alert(res.data.detail)
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        if (error.status === 422) {
          alert(error?.response?.data.detail[0].msg);
        } else {
          alert(error?.response?.data.detail);
        }
      } else {
        console.error('Error:', error);
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      identityNumber: "",
      email: "",
      birthDate: dayjs(),
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(5, "Must be 2 characters or more")
        .required("Required"),
      identityNumber: Yup.number()
        .required("Required")
        .positive("Must be a positive number")
        .integer(),
      email: Yup.string().email("Invalid email address").required("Required"),
      birthDate: Yup.date().required("Required"),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });
  return (
    <div className="flex items-center justify-items-center min-h-screen w-full p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="w-full h-full flex justify-center items-center">
        <div className="border rounded-xl shadow-md sm:w-[400px] w-[90%] p-10 flex justify-center items-center flex-col">
          <h1 className="text-2xl mb-8 font-semibold">Submit User Data</h1>
          <form
            className="flex flex-col gap-6 w-full"
            onSubmit={formik.handleSubmit}
          >
            <div className="flex flex-col">
              <label htmlFor="name">Name</label>
              <input
                className="border rounded border-gray-300 px-3 py-[7px]"
                id="name"
                name="name"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
              {formik.touched.name && formik.errors.name ? (
                <div className="text-red-500 text-sm">{formik.errors.name}</div>
              ) : null}
            </div>

            <div className="flex flex-col">
              <label htmlFor="identityNumber">Identity Number</label>
              <input
                className="border rounded border-gray-300 px-3 py-[7px]"
                id="identityNumber"
                name="identityNumber"
                type="number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.identityNumber}
              />
              {formik.touched.identityNumber && formik.errors.identityNumber ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.identityNumber}
                </div>
              ) : null}
            </div>

            <div className="flex flex-col">
              <label htmlFor="email">Email Address</label>
              <input
                className="border rounded border-gray-300 px-3 py-[7px]"
                id="email"
                name="email"
                type="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.email}
                </div>
              ) : null}
            </div>

            <div className="flex flex-col">
              <label htmlFor="birthDate">Birth Date</label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  disableFuture
                  timezone="Europe/London"
                  format="DD/MM/YYYY"
                  value={dayjs(formik.values.birthDate)}
                  onChange={(value) =>
                    formik.setFieldValue("birthDate", value, true)
                  }
                  slotProps={{
                    textField: {
                      variant: "outlined",
                      size: "small",
                      error:
                        formik.touched.birthDate &&
                        Boolean(formik.errors.birthDate),
                      // helperText: formik.touched.birthDate && formik.errors.birthDate,
                    },
                  }}
                />
              </LocalizationProvider>
            </div>

            <button
              className="border rounded border-gray-300 p-2 bg-blue-500 text-white"
              type="submit"
            >
              Submit
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
