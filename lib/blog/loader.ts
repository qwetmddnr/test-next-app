import type { Article } from "@/lib/blog/types";
import tetoEgenYuhyeong from "@/data/articles/teto-egen-yuhyeong";
import jeongsinYeonryeong from "@/data/articles/jeongsin-yeonryeong";
import beonautJagajindan from "@/data/articles/beonaut-jagajindan";
import mbti16Yuhyeong from "@/data/articles/mbti-16-yuhyeong";
import dongmulsangJongryu from "@/data/articles/dongmulsang-jongryu";
import tarotMajorArcana from "@/data/articles/tarot-major-arcana";
import byeoljari12Seonggyeok from "@/data/articles/byeoljari-12-seonggyeok";
import kkumHaemongBest from "@/data/articles/kkum-haemong-best";
import sajuPaljaGibon from "@/data/articles/saju-palja-gibon";
import ddi12Seonggyeok from "@/data/articles/12-ddi-seonggyeok";
import yeonaeYuhyeong from "@/data/articles/yeonae-yuhyeong-gaide";
import cheonjikJeokseong from "@/data/articles/cheonjik-jeokseong-chatgi";
import naehyangOehyang from "@/data/articles/naehyang-oehyang-cha-i";

const ARTICLES: Record<string, Article> = {
  [tetoEgenYuhyeong.slug]: tetoEgenYuhyeong,
  [jeongsinYeonryeong.slug]: jeongsinYeonryeong,
  [beonautJagajindan.slug]: beonautJagajindan,
  [mbti16Yuhyeong.slug]: mbti16Yuhyeong,
  [dongmulsangJongryu.slug]: dongmulsangJongryu,
  [tarotMajorArcana.slug]: tarotMajorArcana,
  [byeoljari12Seonggyeok.slug]: byeoljari12Seonggyeok,
  [kkumHaemongBest.slug]: kkumHaemongBest,
  [sajuPaljaGibon.slug]: sajuPaljaGibon,
  [ddi12Seonggyeok.slug]: ddi12Seonggyeok,
  [yeonaeYuhyeong.slug]: yeonaeYuhyeong,
  [cheonjikJeokseong.slug]: cheonjikJeokseong,
  [naehyangOehyang.slug]: naehyangOehyang,
};

export function getArticle(slug: string): Article | null {
  return ARTICLES[slug] ?? null;
}

export function getAllArticleSlugs(): string[] {
  return Object.keys(ARTICLES);
}

// publishedAt 내림차순 (최신 글이 먼저)
export function getAllArticles(): Article[] {
  return Object.values(ARTICLES).sort((a, b) =>
    a.publishedAt < b.publishedAt ? 1 : a.publishedAt > b.publishedAt ? -1 : 0
  );
}

export function getOtherArticles(excludeSlug: string, limit = 3): Article[] {
  return getAllArticles()
    .filter((a) => a.slug !== excludeSlug)
    .slice(0, limit);
}
