﻿using Qayimli.Core.Entities.Identity;
using Qayimli.Core.Service;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Qayimli.Service
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _configuration;

        public TokenService(IConfiguration configuration) {
            _configuration = configuration;
        }
        public async Task<string> CreateTokenAsync(AppUser user, UserManager<AppUser> userManager)
        {
            //PayLoad [Data] [Claims]
            //1. Private Claims
            var authUserClaims = new List<Claim>()
            {
               new Claim(ClaimTypes.GivenName,user.DisplayName),
               new Claim(ClaimTypes.Email,user.Email),
            };

            var userRoles = await userManager.GetRolesAsync(user);
            foreach(var role in userRoles)
            {
                authUserClaims.Add(new Claim(ClaimTypes.Role, role));
            }

            //2. Register Claims

            var authKey=new SymmetricSecurityKey(Encoding.UTF8.GetBytes( _configuration["JWT:Key"]));

            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddDays(double.Parse(_configuration["JWT:DurationInDays"])),
                claims: authUserClaims,
                signingCredentials:new SigningCredentials(authKey,SecurityAlgorithms.HmacSha256));

            return  new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
