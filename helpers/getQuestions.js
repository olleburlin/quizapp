export async function getQuestions() {
  const res = await fetch("https://opentdb.com/api.php?amount=3&type=multiple");
  const json = await res.json();

  return {
    props: {
      questions: json.results,
    },
  };
}
