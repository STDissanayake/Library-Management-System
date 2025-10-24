package com.library_management_system.Library.Management.System.service;

import com.library_management_system.Library.Management.System.dto.*;
import java.util.List;

public interface BorrowService {
    String addBorrow(BorrowSaveDTO borrowSaveDTO);
    List<BorrowDTO> getAllBorrow();
    String updateBorrow(BorrowUpdateDTO borrowUpdateDTO);
    String returnBook(ReturnDTO returnDTO);
    List<BorrowDTO> getOverdueBooks();
    List<BorrowDTO> getMemberBorrows(Long memberId);
    List<BorrowDTO> getActiveBorrows();
    String updateOverdueStatus();
    boolean canMemberBorrow(Long memberId);
    int getMaxBooksAllowed();
}