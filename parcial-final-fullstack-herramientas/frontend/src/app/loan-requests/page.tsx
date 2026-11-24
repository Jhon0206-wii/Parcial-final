import Link from "next/link";
import { apiFetch } from "../../lib/api";
import type { LoanRequest, Tool } from "../../lib/loan-types";

type LoanRequestsPageProps = { searchParams: Promise<{ toolId?: string }> };

export default async function LoanRequestsPage({ searchParams }: LoanRequestsPageProps) {
  const toolsResponse = await apiFetch("/tools");
  const tools: Tool[] = toolsResponse.ok ? await toolsResponse.json() : [];
  const { toolId } = await searchParams;
  const query = toolId ? `?${new URLSearchParams({ toolId })}` : "";
  const requestsResponse = await apiFetch(`/loan-requests${query}`);
  const requests: LoanRequest[] = requestsResponse.ok ? await requestsResponse.json() : [];

  return (
    <main>
      <h1>Loan requests</h1>
      <Link className="button" href="/loan-requests/new">New request</Link>
      <form className="filters" method="get">
        <label>
          Tool
          <select name="toolId" defaultValue={toolId ?? ""}>
            <option value="">All tools</option>
            {tools.map((tool) => (
              <option key={tool.id} value={tool.id}>{tool.name}</option>
            ))}
          </select>
        </label>
        <button type="submit">Filter</button>
      </form>
      <section className="panel" aria-label="Loan requests">
        {requests.length === 0 ? <p>No loan requests found.</p> : (
          <table>
            <thead><tr><th>ID</th><th>Tool</th><th>Purpose</th><th>Days</th><th>Receipt</th></tr></thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>{request.id}</td>
                  <td>{request.tool.name}</td>
                  <td>{request.purpose}</td>
                  <td>{request.days}</td>
                  <td><Link href={`/loan-requests/${request.id}`}>View receipt</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
