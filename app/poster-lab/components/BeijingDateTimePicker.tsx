"use client";

import DatePicker from "react-datepicker";
import { useMemo } from "react";
import { beijingPickerDateToUtcInstant, utcInstantToBeijingPickerDate } from "../../lib/time";
import styles from "../poster-lab.module.css";

type BeijingDateTimePickerProps = {
  value: Date;
  onChange: (date: Date) => void;
};

export function BeijingDateTimePicker({ value, onChange }: BeijingDateTimePickerProps) {
  // Business state stays as a UTC instant. The picker Date intentionally carries
  // Beijing wall-clock fields in the user's local Date getters for react-datepicker.
  const pickerDate = useMemo(() => utcInstantToBeijingPickerDate(value), [value]);

  return (
    <label className={styles.field}>
      <span>北京时间日期时间</span>
      <DatePicker
        aria-label="北京时间日期时间"
        selected={pickerDate}
        onChange={(nextPickerDate: Date | null) => {
          // react-datepicker returns local Date fields; interpret those fields as
          // Beijing wall time and convert back to the UTC instant in config.date.
          const utcInstant = nextPickerDate ? beijingPickerDateToUtcInstant(nextPickerDate) : null;
          if (utcInstant) onChange(utcInstant);
        }}
        calendarClassName={styles.datePickerCalendar}
        calendarStartDay={1}
        className={styles.datePickerInput}
        dateFormat="yyyy-MM-dd HH:mm"
        placeholderText="YYYY-MM-DD HH:mm"
        popperClassName={styles.datePickerPopper}
        shouldCloseOnSelect={false}
        showPopperArrow={false}
        showTimeSelect
        timeCaption="时间"
        timeFormat="HH:mm"
        timeIntervals={30}
        wrapperClassName={styles.datePicker}
      />
    </label>
  );
}
