import express, { Request, Response } from "express";
import axios from "axios";
import { Filter, ResponseData, Submissions } from "./intefaces";

require("dotenv").config();

const app = express();
const PORT = 3000;

app.get("/", (req: Request, res: Response) => {
  res.status(200).send(`Welcome to the root URL of the server. 
    Another endpoint is available at /:formId/filteredResponses where formId is a Fillout.com form Id.`);
});

app.get("/:formId/filteredResponses", async (req: Request, res: Response) => {
  const formId = req.params.formId;
  const filters = req.query.filters as string;

  const {
    limit,
    afterDate,
    beforeDate,
    offset,
    status,
    includeEditLink,
    sort,
  } = req.query;
  const parsedLimit = limit ? parseInt(limit as string, 10) : undefined;
  const parsedOffset = offset ? parseInt(offset as string, 10) : undefined;
  const parsedStatus = status ? status.toString() : undefined;
  const parsedIncludeEditLink = includeEditLink
    ? includeEditLink === "true"
    : undefined;
  const parsedSort = sort ? sort.toString() : "asc";
  const parsedAfterDate = afterDate ? afterDate.toString() : "";
  const parsedBeforeDate = beforeDate ? beforeDate.toString() : "";

  try {
    const submissions = await fetchSubmissions(
      formId,
      parsedLimit,
      parsedAfterDate,
      parsedBeforeDate,
      parsedOffset,
      parsedStatus,
      parsedIncludeEditLink,
      parsedSort
    );

    let filteredResponses: ResponseData[];

    if (filters) {
      filteredResponses = applyFilters(submissions, filters);
    } else {
      filteredResponses = submissions.responses;
    }

    const paginatedResponse = paginateResponse(
      filteredResponses,
      parsedLimit,
      parsedOffset
    );

    res.json({
      responses: paginatedResponse,
      totalResponses: filteredResponses.length,
      pageCount: Math.ceil(filteredResponses.length / (parsedLimit || 150)),
    });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).send(`Something happened! Here's the error \n ${error}`);
  }
});

const fetchSubmissions = async (
  formId: string,
  limit?: number,
  afterDate?: string,
  beforeDate?: string,
  offset?: number,
  status?: string,
  includeEditLink?: boolean,
  sort?: string
): Promise<Submissions> => {
  try {
    const response = await axios.get<Submissions>(
      `https://api.fillout.com/v1/api/forms/${formId}/submissions`,
      {
        params: {
          limit,
          afterDate,
          beforeDate,
          offset,
          status,
          includeEditLink,
          sort,
        },
        headers: { Authorization: `Bearer ${process.env.AUTH_FILLOUT_TEST}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const applyFilters = (
  submissions: Submissions,
  filters: string
): ResponseData[] => {
  const parsedFilters: Filter[] = JSON.parse(filters);
  return submissions.responses.filter((response) => {
    return parsedFilters.every((filter) => {
      const question = response.questions.find((q) => q.id === filter.id);
      if (!question) return false;

      const filterValue =
        typeof filter.value === "string" && !isNaN(Number(filter.value))
          ? parseFloat(filter.value)
          : filter.value;
      const questionValue =
        typeof question.value === "string" && !isNaN(Number(question.value))
          ? parseFloat(question.value)
          : question.value;

      if (questionValue === null) return false;
      switch (filter.condition) {
        case "equals":
          return questionValue === filterValue;
        case "does_not_equal":
          return questionValue !== filterValue;
        case "greater_than":
          return questionValue > filterValue;
        case "less_than":
          return questionValue < filterValue;
        default:
          return false;
      }
    });
  });
};

const paginateResponse = (
  responses: ResponseData[],
  limit?: number,
  offset?: number
): ResponseData[] => {
  return responses.slice(offset || 0, (offset || 0) + (limit || 150));
};

app.listen(PORT, () => {
  console.log(`Server is running and listening on port ${PORT}`);
});
