from sqlalchemy import create_engine, Column, Integer, String, Boolean, Float, Date, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, relationship

DATABASE_URL = "sqlite:///./mlms.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

Base = declarative_base()
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


 

class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    cnic = Column(String)
    phone = Column(String)
    address = Column(String)
    risk_score = Column(String)


class Loan(Base):
    __tablename__ = "loans"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"))
    amount = Column(Float)
    type = Column(String)
    duration = Column(Integer)
    start_date = Column(String)

    installments = relationship("Installment", back_populates="loan")


class Installment(Base):
    __tablename__ = "installments"

    id = Column(Integer, primary_key=True, index=True)
    loan_id = Column(Integer, ForeignKey("loans.id"))
    due_date = Column(String)
    amount = Column(Float)
    paid = Column(Boolean, default=False)

    loan = relationship("Loan", back_populates="installments")


def init_db():
    Base.metadata.create_all(bind=engine)
