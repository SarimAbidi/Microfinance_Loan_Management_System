 
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm

from db import SessionLocal, init_db, Client, Loan, Installment
from auth import authenticate_user, create_token, get_current_user
from ai_model import predict_risk

from datetime import datetime, timedelta

app = FastAPI()
init_db()

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def generate_installments(loan_id: int, amount: float, duration: int, start_date: str, db):
    installment_amount = round(amount / duration, 2)
    start = datetime.fromisoformat(start_date)

    for i in range(duration):
        due = start + timedelta(days=30 * (i + 1))
        inst = Installment(
            loan_id=loan_id,
            due_date=due.date().isoformat(),
            amount=installment_amount,
            paid=False
        )
        db.add(inst)
    db.commit()


@app.post("/login")
def login(form: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form.username, form.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username/password")
    token = create_token(form.username)
    return {"access_token": token, "token_type": "bearer"}


 

@app.get("/clients")
def list_clients(user=Depends(get_current_user)):
    db = SessionLocal()
    return db.query(Client).all()


@app.post("/clients")
def create_client(data: dict, user=Depends(get_current_user)):
    db = SessionLocal()
    risk = predict_risk()

    c = Client(
        name=data["name"],
        cnic=data["cnic"],
        phone=data["phone"],
        address=data["address"],
        risk_score=risk
    )
    db.add(c)
    db.commit()
    db.refresh(c)
    return c


 

@app.get("/loans")
def list_loans(user=Depends(get_current_user)):
    db = SessionLocal()
    loans = db.query(Loan).all()
    return loans


@app.post("/loans")
def create_loan(data: dict, user=Depends(get_current_user)):
    db = SessionLocal()
    loan = Loan(
        client_id=data["client_id"],
        amount=data["amount"],
        type=data["type"],
        duration=data["duration"],
        start_date=data["start_date"]
    )
    db.add(loan)
    db.commit()
    db.refresh(loan)

    generate_installments(loan.id, loan.amount, loan.duration, loan.start_date, db)

    return loan


 

@app.get("/installments")
def list_installments(user=Depends(get_current_user)):
    db = SessionLocal()
    inst = db.query(Installment).all()
    return inst


@app.post("/installments/{inst_id}/pay")
def mark_paid(inst_id: int, user=Depends(get_current_user)):
    db = SessionLocal()
    inst = db.query(Installment).get(inst_id)
    inst.paid = True
    db.commit()
    return {"status": "paid"}
