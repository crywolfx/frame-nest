"use client";

import { ConfigProvider, DatePicker } from "antd";
import zhCN from "antd/locale/zh_CN";
import datePickerZhCN from "antd/es/date-picker/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { useMemo } from "react";
import { beijingPickerDateToUtcInstant, utcInstantToBeijingPickerDate } from "../../lib/time";
import styles from "../poster-lab.module.css";

type BeijingDateTimePickerProps = {
  value: Date;
  onChange: (date: Date) => void;
};

dayjs.locale("zh-cn");

export function BeijingDateTimePicker({ value, onChange }: BeijingDateTimePickerProps) {
  // Business state stays as a UTC instant. The picker value intentionally carries
  // Beijing wall-clock fields in local getters so machine timezone cannot change
  // what the user sees or selects.
  const pickerDate = useMemo(() => dayjs(utcInstantToBeijingPickerDate(value)), [value]);

  return (
    <label className={styles.field}>
      <span>北京时间日期时间</span>
      <ConfigProvider locale={zhCN}>
        <DatePicker
          aria-label="北京时间日期时间"
          className={styles.datePicker}
          format="YYYY-MM-DD HH:mm"
          locale={datePickerZhCN}
          needConfirm
          onChange={(nextPickerDate) => {
            const utcInstant = nextPickerDate ? beijingPickerDateToUtcInstant(nextPickerDate.toDate()) : null;
            if (utcInstant) onChange(utcInstant);
          }}
          placeholder="YYYY-MM-DD HH:mm"
          showNow
          showTime={{ format: "HH:mm", minuteStep: 30 }}
          value={pickerDate}
        />
      </ConfigProvider>
    </label>
  );
}
