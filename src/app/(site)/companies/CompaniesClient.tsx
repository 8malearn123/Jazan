"use client";

import { useMemo, useState } from "react";
import { SearchIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import type { Company, Job } from "@/lib/types";
import { CompanyCard } from "./CompanyCard";
import { JobRow } from "./JobRow";

const jobTypes = ["الكل", "دوام كامل", "عن بُعد", "دوام جزئي"];

export function CompaniesClient({ companies, jobs }: { companies: Company[]; jobs: Job[] }) {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("all");
  const [jobType, setJobType] = useState("الكل");

  const cities = useMemo(
    () => Array.from(new Set(companies.map((c) => c.city).filter(Boolean) as string[])).sort(),
    [companies]
  );

  const q = query.trim().toLowerCase();

  const filteredCompanies = useMemo(
    () =>
      companies.filter((c) => {
        const inQuery =
          !q || c.name.toLowerCase().includes(q) || c.field.toLowerCase().includes(q);
        const inCity = city === "all" || c.city === city;
        return inQuery && inCity;
      }),
    [companies, q, city]
  );

  const filteredJobs = useMemo(
    () =>
      jobs.filter((j) => {
        const inQuery =
          !q || j.title.toLowerCase().includes(q) || j.companyName.toLowerCase().includes(q);
        const inType = jobType === "الكل" || j.type === jobType;
        return inQuery && inType;
      }),
    [jobs, q, jobType]
  );

  return (
    <>
      {/* البحث + المدينة */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2.5 rounded-[13px] border-[1.5px] border-line bg-surface px-4 py-3 focus-within:border-jazan">
          <SearchIcon className="h-[19px] w-[19px] shrink-0 text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن وظيفة أو شركة…"
            className="w-full bg-transparent text-[15px] text-charcoal outline-none placeholder:text-[#9aa29d]"
          />
        </div>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="rounded-[13px] border-[1.5px] border-line bg-surface px-4 py-3 text-sm text-charcoal outline-none focus:border-jazan"
        >
          <option value="all">كل المدن</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* شبكة الشركات */}
      <p className="mt-5 text-[13px] text-muted">
        <span className="mono font-semibold text-charcoal">{filteredCompanies.length}</span> شركة
      </p>
      {filteredCompanies.length > 0 ? (
        <div className="mt-3 grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCompanies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      ) : (
        <div className="mt-3 rounded-[18px] border border-dashed border-line bg-surface py-12 text-center">
          <p className="text-[15px] font-semibold text-charcoal">لا توجد شركات مطابقة</p>
        </div>
      )}

      {/* أحدث الوظائف */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-charcoal sm:text-2xl">أحدث الوظائف</h2>

        {/* شرائح نوع الدوام */}
        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          {jobTypes.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setJobType(t)}
              className={cn(
                "cursor-pointer rounded-full border-[1.5px] px-4 py-2 text-[13px] font-semibold transition-colors",
                jobType === t
                  ? "border-info bg-info text-white"
                  : "border-line bg-surface text-ink hover:border-jazan"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {filteredJobs.length > 0 ? (
          <div className="mt-5 flex flex-col gap-3.5">
            {filteredJobs.map((job) => (
              <JobRow key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-[18px] border border-dashed border-line bg-surface py-12 text-center">
            <p className="text-[15px] font-semibold text-charcoal">لا توجد وظائف مطابقة</p>
          </div>
        )}
      </section>
    </>
  );
}
