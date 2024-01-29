"use client"
import { scrapeAndStoreProduct } from "@/lib/actions";
import { redirect } from "next/navigation";
import { FormEvent, useState } from "react"
import { useRouter } from "next/router";

const isValiedAmazonProductURL = (url: string) => {
    try {
        const parsedurl = new URL(url);
        const hostname = parsedurl.hostname;
        if (hostname.includes("amazon.com") || hostname.includes("amazon.") || hostname.endsWith("amazon")) {
            return true;
        }
    } catch (error) {
        return false;
    }
    return false;
}
const Searchbar = () => {
    const [searchPrompt, setSearchPrompt] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const [url, seturl] = useState(null);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const isValiedLink = isValiedAmazonProductURL(searchPrompt);
        if (!isValiedLink) return alert("please provide a valid amazon link")
        try {
            setIsLoading(true);
            const product = await scrapeAndStoreProduct(searchPrompt);
            seturl(product);
            redirect(`/products/${url}`)

        } catch (error) {
            console.log(error);
        }
        finally {

            setIsLoading(false);
        }
    }
    return (
        <form className="flex flex-wrap gap-4 mt-12" onSubmit={handleSubmit}>
            <input type="text"
                value={searchPrompt}
                onChange={(e) => setSearchPrompt(e.target.value)}
                placeholder="Enter product link"
                className="searchbar-input"
            />
            <button type="submit" className="searchbar-btn"
                disabled={searchPrompt === ''}
            >
                {isLoading ? "Searching..." : "Search"}
            </button>
        </form>
    )
}

export default Searchbar