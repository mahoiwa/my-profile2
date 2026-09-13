
import Bookcard from './Bookcard.jsx'



function App() {
  return (
    <>
    <h1 className="text-2xl">書籍紹介ページ</h1>
    <main className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">わたしの本棚</h1>
      {books.map((book) => (
        <Bookcard
          key={book.id}
          title={book.title}
          author={book.author}
          rating={book.rating}
          comment={book.comment}
        />
      ))}
    </main>
    </>
  
    );
}







export default App;