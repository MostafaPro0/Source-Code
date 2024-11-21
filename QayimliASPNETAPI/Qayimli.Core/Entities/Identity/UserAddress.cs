﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Qayimli.Core.Entities.Identity
{
    public class UserAddress
    {
        public int Id { get; set;}  
        public string FirstName { get; set;}
        public string LastName { get; set;}
        public string Street { get; set;}

        public string City { get; set;}

        public string Country { get; set;}

        public string AppUserId { get; set; }//ForeignKey
        public AppUser User { get; set;}
    }
}
