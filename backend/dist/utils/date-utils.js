"use strict";
/**
 * Tarih formatı yardımcı fonksiyonları
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDaysBetween = exports.formatLocalDate = exports.parseLocalDate = void 0;
/**
 * GG/AA/YYYY formatındaki bir tarihi Date nesnesine dönüştürür
 * @param dateString GG/AA/YYYY formatında tarih dizgisi (örn: 16/05/2025)
 * @returns Date nesnesi veya geçersiz tarih ise null
 */
const parseLocalDate = (dateString) => {
    if (!dateString)
        return null;
    const regex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    const match = dateString.match(regex);
    if (!match)
        return null;
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1;
    const year = parseInt(match[3], 10);
    const date = new Date(year, month, day);
    if (date.getFullYear() !== year ||
        date.getMonth() !== month ||
        date.getDate() !== day) {
        return null;
    }
    return date;
};
exports.parseLocalDate = parseLocalDate;
/**
 * Date nesnesini GG/AA/YYYY formatına dönüştürür
 * @param date Date nesnesi
 * @returns GG/AA/YYYY formatında tarih dizgisi
 */
const formatLocalDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};
exports.formatLocalDate = formatLocalDate;
/**
 * İki tarih arasındaki gün farkını hesaplar
 * @param startDate Başlangıç tarihi
 * @param endDate Bitiş tarihi
 * @returns Gün farkı
 */
const getDaysBetween = (startDate, endDate) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.round(diffTime / oneDay);
};
exports.getDaysBetween = getDaysBetween;
