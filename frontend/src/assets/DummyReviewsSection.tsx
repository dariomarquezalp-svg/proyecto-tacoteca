import { useMemo } from "react";
import type { Product } from "../types";
import { StarIcon, ThumbsUpIcon } from "lucide-react";

/* ─── Dummy Reviews Section ─── */
const REVIEWERS = [
    { name: "Ananya S.", avatar: "AS" },
    { name: "Rahul M.", avatar: "RM" },
    { name: "Priya K.", avatar: "PK" },
    { name: "Vikram J.", avatar: "VJ" },
    { name: "Meera D.", avatar: "MD" },
    { name: "Arjun R.", avatar: "AR" },
    { name: "Sneha T.", avatar: "ST" },
    { name: "Karan P.", avatar: "KP" },
];

const COMMENTS = [
    "Absolutely love this product! Fresh and great quality. Will definitely order again.",
    "Good value for the price. Packaging was neat and delivery was on time.",
    "Quality is decent but I expected it to be a bit fresher. Still a solid buy overall.",
    "This has become a staple in my kitchen now. Highly recommended for everyone!",
    "Exceeded my expectations. The taste and freshness were top-notch. Five stars!",
    "Pretty good! Not the absolute best I've had, but definitely worth the price.",
    "Arrived in perfect condition. Very satisfied with the purchase, ordering more soon.",
    "Great product, my family loved it. The organic quality really shows in the taste.",
];

function seededRandom(seed: string) {
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
    return () => { h = (h ^ (h >>> 16)) * 0x45d9f3b; h = (h ^ (h >>> 16)) * 0x45d9f3b; h ^= h >>> 16; return (h >>> 0) / 0xffffffff; };
}

export default function DummyReviewsSection() {
    // Reviews removed per project request
    return null;
}