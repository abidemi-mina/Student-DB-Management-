import { Field } from "./Field";
import { Section } from "./Section";

export default function Form() {
  return (
    <div className="space-y-6">
      {/* Student Section */}
      <Section title="Student Details">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Field label="Matric Number" name="matricNumber" placeholder="e.g. 22/SCIXX/003" />
          <Field label="First Name" name="firstName" placeholder="First name" />
          <Field label="Middle Name" name="middleName" placeholder="Middle name" />

          <Field label="Last Name" name="lastName" placeholder="Last name" />
          <Field label="Date of Birth" name="dob" type="date" />
          <div className="space-y-1">
            <label htmlFor="gender" className="text-sm font-medium text-zinc-700">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm
                         outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/20"
              defaultValue=""
            >
              <option value="" disabled>
                Select gender
              </option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>

          <Field label="Email" name="email" type="email" placeholder="example@gmail.com" />
          <Field label="Phone Number" name="phone" type="tel" placeholder="080..." />
          <Field label="LGA of Origin" name="lgaOfOrigin" placeholder="e.g. Ikeja" />

          <Field label="State of Origin" name="stateOfOrigin" placeholder="e.g. Lagos" />
          <Field label="Nationality" name="nationality" placeholder="e.g. Nigerian" />
        </div>

        <div className="mt-4 space-y-1">
          <label htmlFor="address" className="text-sm font-medium text-zinc-700">
            Address
          </label>
          <textarea
            id="address"
            name="address"
            className="min-h-[90px] w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm
                       outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/20"
            placeholder="Enter full address..."
          />
        </div>
      </Section>

      {/* Academic Section */}
      <Section title="Academic Details">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Field label="Matric Number" name="academicMatricNumber" placeholder="e.g. 22/SCIXX/003" />

          <Field
            label="Year of Enrollment"
            name="yearOfEnrollment"
            type="number"
            placeholder="e.g. 2024"
          />

          <Field
            label="Expected Year of Graduation"
            name="expectedGraduationYear"
            type="number"
            placeholder="e.g. 2028"
          />

          <div className="space-y-1">
            <label htmlFor="currentLevel" className="text-sm font-medium text-zinc-700">
              Current Level
            </label>
            <select
              id="currentLevel"
              name="currentLevel"
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm
                         outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/20"
              defaultValue=""
            >
              <option value="" disabled>
                Select level
              </option>
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="300">300</option>
              <option value="400">400</option>
              <option value="500">500</option>
              <option value="600">600</option>
            </select>
          </div>

          <Field
            label="Current Academic Year"
            name="currentAcademicYear"
            placeholder="e.g. 2025/2026"
          />

          <Field
            label="Current CGPA"
            name="currentCgpa"
            type="number"
            placeholder="e.g. 4.35"
          />

          <Field
            label="Current Class Position"
            name="classPosition"
            type="number"
            placeholder="e.g. 12"
          />
        </div>
      </Section>
    </div>
  );
}
