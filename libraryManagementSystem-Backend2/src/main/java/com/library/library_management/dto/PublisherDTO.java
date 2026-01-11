package com.library.library_management.dto;

public class PublisherDTO {
    private Long id;
    private String name;
    private String address;
    private String contactInfo;

    // Constructors
    public PublisherDTO() {}

    public PublisherDTO(Long id, String name, String address, String contactInfo) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.contactInfo = contactInfo;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getContactInfo() { return contactInfo; }
    public void setContactInfo(String contactInfo) { this.contactInfo = contactInfo; }
}
