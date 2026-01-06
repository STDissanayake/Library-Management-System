package com.library_management_system.Library.Management.System.repo;

import com.library_management_system.Library.Management.System.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberRepo extends JpaRepository<Member, Long> {  // Changed from Integer to Long
}