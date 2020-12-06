import React, { useState, useEffect } from "react";
import Link from "next/link";
import Layout from "../components/Layout";

function Index({ questions }) {
  return (
    <Layout>
      <section className="max-w-4xl mx-auto text-center">
        <div className="">
          <Link href="/quiz">
            <button className="bg-purple-600 text-white py-2 px-4 rounded-sm text-xl">
              Start Quiz
            </button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}

export default Index;
