const books = [
  {
    id: 1,
    title: "JavaScript入門",
    author: "田中 太郎",
    rating: "★★★★☆",
    comment: "基礎からていねいで、最初の1冊によかった。",
  },
  {
    id: 2,
    title: "Reactの教科書",
    author: "山田 花子",
    rating: "★★★★★",
    comment: "コンポーネント設計の考え方が勉強になった。",
  },
  {
    id: 3,
    title: "CSS設計完全ガイド",
    author: "鈴木 一郎",
    rating: "★★★☆☆",
    comment: "分厚いが、辞書として手元に置きたい。",
  },
];

function BookCard({ title, author, rating, comment }) {
  return (
    <article className="border rounded-lg p-4 shadow-sm">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-sm text-gray-600">{author}</p>
      <p className="mt-2">{rating}</p>
      <p className="mt-2">{comment}</p>
    </article>
  );
}

export default BookCard;