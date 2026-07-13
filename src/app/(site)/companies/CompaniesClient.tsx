"use client";

import { useEffect, useMemo, useState } from "react";
import { SearchIcon, MapIcon } from "@/components/icons";
import { JazanMap } from "@/components/home/JazanMap";
import { cn } from "@/lib/cn";
import { useLocale } from "@/lib/i18n";
import { normalizeText } from "@/lib/text";
import { companyMatches, jobMatches } from "@/lib/search";
import { governorates } from "@/lib/jazan-map";
import {
  approvedOffers,
  loadOfferModeration,
  onOfferModerationChange,
} from "@/lib/offers";
import type { Company, Job } from "@/lib/types";
import { CompanyCard } from "./CompanyCard";
import { JobRow } from "./JobRow";

const jobTypes = ["الكل", "دوام كامل", "عن بُعد", "دوام جزئي"];

export function CompaniesClient({ companies, jobs: baseJobs }: { companies: Company[]; jobs: Job[] }) {
  const { d, isAr } = useLocale();
  const [query, setQuery] = useState("");
  const [mapOpen, setMapOpen] = useState(false);
  const [city, setCity] = useState("all");
  const [jobType, setJobType] = useState("الكل");

  // عروض الشركات المعتمدة من الإدارة تُنشر هنا مع الوظائف الأساسية
  const [extraJobs, setExtraJobs] = useState<Job[]>([]);
  useEffect(() => {
    const update = () => setExtraJobs(approvedOffers(loadOfferModeration()));
    update();
    return onOfferModerationChange(update);
  }, []);
  const jobs = useMemo(() => [...extraJobs, ...baseJobs], [extraJobs, baseJobs]);

  // كل محافظات جازان — نفس قائمة الخريطة التفاعلية
  const cities = governorates.map((g) => ({ value: g.ar, label: isAr ? g.ar : g.en }));

  const q = normalizeText(query.trim());

  const filteredCompanies = useMemo(
    () =>
      companies.filter((c) => {
        const inQuery = companyMatches(c, q, jobs);
        const inCity = city === "all" || normalizeText(c.city ?? "") === normalizeText(city);
        return inQuery && inCity;
      }),
    [companies, jobs, q, city]
  );

  const filteredJobs = useMemo(
    () =>
      jobs.filter((j) => {
        const inQuery = jobMatches(j, q);
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
            placeholder={d.companiesPage.searchPh}
            className="w-full bg-transparent text-[15px] text-charcoal outline-none placeholder:text-[#9aa29d]"
          />
        </div>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="rounded-[13px] border-[1.5px] border-line bg-surface px-4 py-3 text-sm text-charcoal outline-none focus:border-jazan"
        >
          <option value="all">{d.companiesPage.allCities}</option>
          {cities.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setMapOpen(true)}
          aria-label={d.map.open}
          title={d.map.open}
          className="flex h-[46px] w-[46px] flex-none cursor-pointer items-center justify-center self-end rounded-[13px] border-[1.5px] border-line bg-surface text-jazan transition-colors hover:border-jazan hover:bg-jazan hover:text-white sm:self-auto"
        >
          <MapIcon width={19} height={19} />
        </button>
      </div>

      <JazanMap open={mapOpen} onClose={() => setMapOpen(false)} />

      {/* شبكة الشركات */}
      <p className="mt-5 text-[13px] text-muted">
        <span className="mono font-semibold text-charcoal">{filteredCompanies.length}</span> {d.companiesPage.company}
      </p>
      {filteredCompanies.length > 0 ? (
        <div className="mt-3 grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCompanies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      ) : (
        <div className="mt-3 rounded-[18px] border border-dashed border-line bg-surface py-12 text-center">
          <p className="text-[15px] font-semibold text-charcoal">{d.companiesPage.emptyCompanies}</p>
        </div>
      )}

      {/* أحدث الوظائف */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-charcoal sm:text-2xl">{d.companiesPage.latestJobs}</h2>

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
              {t === "الكل" ? d.companiesPage.all : d.jobType[t] ?? t}
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
            <p className="text-[15px] font-semibold text-charcoal">{d.companiesPage.emptyJobs}</p>
          </div>
        )}
      </section>
    </>
  );
}
