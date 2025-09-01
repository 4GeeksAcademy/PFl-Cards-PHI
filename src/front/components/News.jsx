import { useEffect, useState } from "react";

const News = () => {
  const [news, setNews] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const resp = await fetch(
          `https://newsdata.io/api/1/news?apikey=${import.meta.env.VITE_NEWSDATA_KEY}&q=video+games&language=en`
        );
        const data = await resp.json();
        console.log("API response:", data);
        if (data.results) {
          setNews(data.results.slice(0, 5)); //   5 noticias
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);

  // Rotación automática de noticias
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % news.length);
    }, 10000); // cambia cada 5s
    return () => clearInterval(interval);
  }, [news]);

  if (news.length === 0) {
    return <p>Cargando noticias...</p>;
  }

  const currentNews = news[index];

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2"> Latest news</h2>
      <div>
        <a
          href={currentNews.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-lg font-semibold text-blue-600 hover:underline"
        >
          {currentNews.title}
        </a>
        <p className="text-gray-700 text-sm mt-1">
          {currentNews.description?.slice(0, 120)}...
        </p>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        {index + 1} / {news.length}
      </p>
    </div>
  );
};

export default News;