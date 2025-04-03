import { Request, Response } from "express";
import { readFile, writeFile } from "fs/promises";

interface Loan {
  id: string;
  amount: string;
  maturityDate: string;
  status: string;
  applicant: {
    name: string;
    email: string;
    telephone: string;
    totalLoan?: string;
  };
  createdAt: string;
}

export async function getAllLoans(req: Request, res: Response) : Promise<any> {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized request" });
    }
    const { status } = req.query;

    const { role } = user;
    const data = await readFile("../../../data/loans.json", "utf-8");
    const loans: Loan[] = JSON.parse(data);

    if (status) {
      const filteredLoans = loans.filter((loan) => loan.status === status);
      return res.status(200).json(filteredLoans);
    }

    if (role !== "admin" || role !== "superAdmin") {
      let staffLoans = [] as Loan[];
      for (const loan of loans) {
        delete loan.applicant.totalLoan;
        staffLoans.push(loan);
      }
      return res.status(200).json(staffLoans);
    }

    res.status(200).json(loans);
  } catch (error) {
    console.error("Error reading loans data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getLoanByUserEmail = async (req: Request, res: Response) : Promise<any> => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(401).json({ message: "Unauthorized request" });
    }
   
    const data = await readFile("../../../data/loans.json", "utf-8");
    const loans: Loan[] = JSON.parse(data);

    const userLoans = loans.filter((loan) => loan.applicant.email === email);

    res.status(200).json(userLoans);
  } catch (error) {
    console.error("Error reading loans data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getExpiredLoan (req:Request, res:Response) : Promise<any> {
  try {
    const data = await readFile("../../../data/loans.json", "utf-8");
    const loans: Loan[] = JSON.parse(data);

    const currentDate = new Date();
    const expiredLoans = loans.filter((loan) => {
      const maturityDate = new Date(loan.maturityDate);
      return maturityDate < currentDate;
    });

    res.status(200).json(expiredLoans);
  } catch (error) {
    console.error("Error reading loans data:", error);
    res.status(500).json({ message: "Internal server error" });
  }  
}

export async function deleteLoan(req:Request, res:Response) : Promise<any> {
  try {
    const { loanId } = req.params;
    const data = await readFile("../../../data/loans.json", "utf-8");
    const loans: Loan[] = JSON.parse(data);

    const updatedLoans = loans.filter((loan) => loan.id !== loanId);

    await writeFile("../../../data/loans.json", JSON.stringify(updatedLoans));
    res.status(200).json({ message: "Loan deleted successfully" });
  } catch (error) {
    console.error("Error deleting loan:", error);
    res.status(500).json({ message: "Internal server error" });
  }
  
}
