package com.library.library_management.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "fines")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Fine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "borrow_id", nullable = false)
    @JsonManagedReference("fine-borrow")
    private Borrow borrow;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    @JsonManagedReference("fine-member")
    private Member member;

    @Column(nullable = false)
    private Double amount;

    @Column(name = "fine_date", nullable = false)
    private LocalDate fineDate;

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    @Column(nullable = false)
    private String status; // PENDING, PAID, WAIVED

    @Column(name = "overdue_days")
    private Integer overdueDays;

    @Column(name = "daily_rate")
    private Double dailyRate;

    private String reason;

    // Constructors
    public Fine() {}

    public Fine(Borrow borrow, Member member, Double amount, LocalDate fineDate, String status) {
        this.borrow = borrow;
        this.member = member;
        this.amount = amount;
        this.fineDate = fineDate;
        this.status = status;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Borrow getBorrow() { return borrow; }
    public void setBorrow(Borrow borrow) { this.borrow = borrow; }

    public Member getMember() { return member; }
    public void setMember(Member member) { this.member = member; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public LocalDate getFineDate() { return fineDate; }
    public void setFineDate(LocalDate fineDate) { this.fineDate = fineDate; }

    public LocalDate getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDate paymentDate) { this.paymentDate = paymentDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getOverdueDays() { return overdueDays; }
    public void setOverdueDays(Integer overdueDays) { this.overdueDays = overdueDays; }

    public Double getDailyRate() { return dailyRate; }
    public void setDailyRate(Double dailyRate) { this.dailyRate = dailyRate; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
