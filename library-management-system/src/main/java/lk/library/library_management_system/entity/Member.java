package com.library_management_system.Library.Management.System.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Member")  // Changed from "app_user" to "Member" to match your database
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")  // Added column mapping
    private Long id;  // Changed from Integer to Long

    @Column(name = "first_name")  // Map to correct column
    private String firstName;

    @Column(name = "last_name")  // Map to correct column
    private String lastName;

    private String email;
    private String address;
    private String phone;

    public Member() {}

    public Member(Long id, String firstName, String lastName, String email) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }

    public Long getId() { return id; }  // Changed return type to Long
    public void setId(Long id) { this.id = id; }  // Changed parameter to Long

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    @Override
    public String toString() {
        return "Member{" +
                "id=" + id +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                '}';
    }
}